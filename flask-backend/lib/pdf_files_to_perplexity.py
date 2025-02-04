import boto3
import fitz
from PIL import Image
import io
from openai import OpenAI
import json
import logging
import os
from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)

PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
PERPLEXITY_MODEL = os.getenv('PERPLEXITY_MODEL')

MAX_PAGES = 6

CLIENT = boto3.client('textract', region_name='us-east-1',
                      aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)


def pdf_to_images(pdf_path):
    logger.info(f'Converting {pdf_path} to images...')
    # Open the PDF file
    pdf_document = fitz.open(pdf_path)
    images = []

    for page_num in range(len(pdf_document)):
        # Get the page
        page = pdf_document.load_page(page_num)

        # Render the page as an image (PNG format)
        pix = page.get_pixmap()
        img = Image.open(io.BytesIO(pix.tobytes()))
        images.append(img)

    return images


def process_image_with_textract(image):
    # Convert image to bytes
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()

    # Send image bytes to Textract
    response = CLIENT.detect_document_text(Document={'Bytes': img_byte_arr})
    return response


def process_images_with_textract(images):
    logger.info(f'Processing {len(images)} images with Textract...')
    # Process each image with Textract
    i = 0
    _ = ''
    for image in images:
        response = process_image_with_textract(image)

        blocks = response['Blocks']
        text = ""
        for block in blocks:
            if block['BlockType'] == 'WORD':
                text += block['Text'] + ' '
            elif block['BlockType'] == 'LINE':
                text += block['Text'] + '\n'

        _ += text

        if i == MAX_PAGES:
            break

        i += 1

    return _


def prompt_perplexity(messages) -> str:
    logger.info('Calling Perplexity...')
    client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")
    # chat completion without streaming
    response = client.chat.completions.create(
        model=PERPLEXITY_MODEL,
        messages=messages,
    )
    # Extract and print the response content
    # Ensure response is properly parsed
    result = json.loads(response.model_dump_json())
    content = result["choices"][0]["message"]["content"]
    
    return content
    
    

def main(age, hasSpouse, dependents):
    # Convert PDF to images
    logger.info('Pdfs to images...')
    home_images = pdf_to_images('homedeclaration.pdf')
    car_images = pdf_to_images('car.pdf')

    logger.info('Textract-ing images')
    txt = process_images_with_textract(home_images) + '\n\n\n\n\n'
    txt += process_images_with_textract(car_images)

    structure = (
    '''
    1. What do you have covered?
        a. Break down by coverage type
    2. What is your overall risk protection score?
        a. Provide an overall score (a percentage)
        b. Break this down by each coverage type - provide reasoning for each
        c. Provide strengths and weaknesses for each of the categories
    3. What are the next steps you can do to defend yourself from further risk?
        a. Provide a step by step analysis based on the risk protection score
        b. Include real policies that could be purchased to supplement the weaknesses. Ensure they fit with the individual's address, family background, age, etc.
    '''
    )

    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant that answers questions about company policies."
                "Only reply with data from your searches if it matches the situation exactly."
                "Only rely on information we provide for you otherwise."
                f"Display things in this exact format: {structure} return your output in markdown"
            )
        },
        {
            "role": "user",
            "content": (
                f"Here is my situation: Age: {age}, Has Spouse: {hasSpouse}, Number of Dependents: {dependents}."
                f"Here are the policies:\n\n{txt}"
            )
        }
    ]

    response = prompt_perplexity(messages)
    
    open('output.md', 'w').write(response)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    main(69, True, 2)