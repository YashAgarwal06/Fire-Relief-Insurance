import Select from 'react-select'

const SelectDocuments = ({ docs, setDocs }) => {

    const options = [
        { label: 'Home Declaration', value: 'Home_Declaration', endpoint: "/upload_hd" },
        { label: 'Health Insurance (Private)', value: 'Health_Insurance_Private', endpoint: "/upload_healthins" },
        { label: 'Medicare/Medicaid', value: 'Medicare', endpoint: "/upload_medicare" },
        { label: 'Car Insurance', value: 'Car_Insurance', endpoint: "/upload_car" },
        { label: 'a', value: 'a', endpoint: '/a'},
        { label: 'b', value: 'b', endpoint: '/b'},
        { label: 'c', value: 'c', endpoint: '/c'},
        { label: 'd', value: 'd', endpoint: '/d'},
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
                    value={docs}
                />
            </form>

        </>
    )
};

export default SelectDocuments;
