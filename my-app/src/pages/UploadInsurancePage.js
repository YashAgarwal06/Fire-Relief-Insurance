import React, { useState, useEffect } from 'react';

const UploadInsurancePage = ({ doc, onNext, isLast, onFileUpload, onSubmit, fileInputs }) => {
    const [declarationFile, setDeclarationFile] = useState(null);

    // Reset UI when switching pages
    useEffect(() => {
        setDeclarationFile(null);
    }, [doc]);

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        setFile(file);
        onFileUpload(doc, 'declaration', file); // Store the file in the parent state
    };

    const isNextDisabled = !declarationFile; // Disable button if no file is uploaded

    return (
        <div style={{ padding: '30px' }}>
            <h3 style={{ textAlign: 'center', fontSize: '22px', marginBottom: '25px', fontWeight: 'bold' }}>
                {`Upload Documents for ${doc?.label || 'Loading...'}`}
            </h3>

            {/* Declaration Document Upload */}
            <div style={{ marginBottom: '30px' }}>
                <div style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>Declaration Document:</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="file"
                        accept=".pdf"
                        id="declaration-upload"
                        onChange={(e) => handleFileChange(e, setDeclarationFile)}
                        style={{ display: 'none' }}
                    />
                    <label
                        htmlFor="declaration-upload"
                        style={{
                            backgroundColor: '#f2f2f2',
                            border: '1px solid #ccc',
                            padding: '12px 20px',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '20px',
                        }}
                    >
                        Choose File
                    </label>
                    <span
                        style={{
                            marginLeft: '15px',
                            fontSize: '14px',
                            flex: 2,
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {declarationFile ? declarationFile.name : 'No file chosen'}
                    </span>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ textAlign: 'center' }}>
                {isLast ? (
                    <button
                        onClick={onSubmit}
                        disabled={isNextDisabled}
                        style={{
                            backgroundColor: isNextDisabled ? '#ccc' : '#000',
                            color: '#fff',
                            padding: '12px 30px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: isNextDisabled ? 'not-allowed' : 'pointer',
                            height: '45px',
                            width: '150px',
                        }}
                    >
                        Submit All
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        disabled={isNextDisabled}
                        style={{
                            backgroundColor: isNextDisabled ? '#ccc' : '#000',
                            color: '#fff',
                            padding: '12px 30px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: isNextDisabled ? 'not-allowed' : 'pointer',
                            height: '45px',
                            width: '150px',
                        }}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default UploadInsurancePage;
