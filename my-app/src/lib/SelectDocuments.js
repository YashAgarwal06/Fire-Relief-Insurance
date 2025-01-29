import Select from 'react-select'

const SelectDocuments = ({ setDocs }) => {

    const options = [
        { label: 'Home Declaration', value: 'Home_Declaration' },
        { label: 'Health Insurance (Private)', value: 'Health_Insurance_Private' },
        { label: 'Medicare/Medicaid', value: 'Medicare' },
        { label: 'Car Insurance', value: 'Car_Insurance' },
    ]

    const handleChange = (doc) => {
        setDocs({ doc })
    }

    return (
        <>
            <h3>Please select</h3>
            <form>
                <Select
                    options={options}
                    onChange={handleChange}
                    isMulti={true}
                />
            </form>

        </>
    )
};

export default SelectDocuments;
