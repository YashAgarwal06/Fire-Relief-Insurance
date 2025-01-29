import os
import openai
from dotenv import load_dotenv
from typing import List

# 1) Load environment variables
load_dotenv()  # This loads variables from .env into os.environ

API_KEY = os.getenv("API_KEY")                # e.g. "YOUR_AZURE_OPENAI_KEY"
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")  # e.g. "https://YOUR-RESOURCE-NAME.openai.azure.com/"
API_VERSION = os.getenv("API_VERSION")  # e.g. "2023-03-15-preview" or the latest version
AZURE_DEPLOYMENT_EMBEDDINGS = os.getenv("AZURE_DEPLOYMENT_EMBEDDINGS")  # e.g. "text-embedding-ada-002"

# 2) Configure openai for Azure OpenAI usage
openai.api_type = "azure"



# 4. Import the updated LangChain Community classes
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# 5. Load your PDF using PyPDFLoader
pdf_path = "/Users/aashmanrastogi/Desktop/fire-relief/Bank Data/BoA_Kevin_Data.pdf"
loader = PyPDFLoader(pdf_path)

# 6. Convert the PDF into a list of Documents
documents = loader.load()
print(f"Original number of Document objects: {len(documents)}")

# 7. Split them into smaller chunks (~500 chars, 100 overlap here as example)
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)
chunked_documents = text_splitter.split_documents(documents)
print(f"Number of chunked Document objects: {len(chunked_documents)}")

# 8. Initialize the Azure OpenAI Embeddings
embeddings = AzureOpenAIEmbeddings(
    openai_api_key=API_KEY,            # pass the key directly
    openai_api_base=AZURE_OPENAI_ENDPOINT,    # your Azure endpoint
    openai_api_type="azure",                  # must be "azure"
    openai_api_version=API_VERSION,
    model_name="text-embedding-3-large"
)

# 9. Create a local Chroma DB (memory-only unless you set persist_directory)
db = Chroma.from_documents(
    documents=chunked_documents,
    embedding=embeddings,
    collection_name="my_collection"
)

# 10. Test a quick similarity search
query = "What is the main topic of this document?"
search_results = db.similarity_search(query, k=3)

for i, result in enumerate(search_results):
    print(f"\n----- Result {i+1} -----")
    print(result.page_content[:250], "...")