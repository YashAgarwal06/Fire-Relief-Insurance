import React from 'react';

const SelectDocuments = ({ docs = [], setDocs, onStartUpload }) => {
    const options = [
        { label: 'Home', value: 'Home' },
        { label: 'Pet', value: 'Pet' },
        { label: 'Life', value: 'Life' },
        { label: 'Earthquake', value: 'Earthquake' },
        { label: 'Flood', value: 'Flood' },
        { label: 'Public Health', value: 'Public_Health' },
        { label: 'Private Health', value: 'Private_Health' },
        { label: 'Auto', value: 'Auto' },
    ];

    const handleCheckboxChange = (option) => {
        const updatedDocs = docs.find(doc => doc.value === option.value)
            ? docs.filter(doc => doc.value !== option.value)
            : [...docs, option]; // Add full object, not just value
        setDocs(updatedDocs);
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Select Insurance Policies</h2>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                    padding: '0 10px',
                }}
            >
                {options.map((option) => (
                    <div
                        key={option.value}
                        onClick={() => handleCheckboxChange(option)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            padding: '15px',
                            cursor: 'pointer',
                            userSelect: 'none',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <input
                            type="checkbox"
                            id={option.value}
                            value={option.value}
                            checked={docs.some(doc => doc.value === option.value)}
                            readOnly
                            style={{
                                marginRight: '10px',
                                pointerEvents: 'none',
                                width: '18px',
                                height: '18px',
                                accentColor: 'black',
                            }}
                        />
                        <label htmlFor={option.value}>{option.label}</label>
                    </div>
                ))}
            </div>
            {docs.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        onClick={onStartUpload}
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '7px',
                            fontSize: '16px',
                        }}
                    >
                        Start Upload
                    </button>
                </div>
            )}
        </div>
    );
};

export default SelectDocuments;
