import React, { useState } from 'react';

const UserDetailsPage = ({ onSubmit, age, setAge, dependents, setDependents, hasSpouse, setHasSpouse }) => {
    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', fontSize: '22px', marginBottom: '20px', fontWeight: 'bold' }}>
                Personal Information
            </h3>

            {/* Age Input */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Age:</label>
                <input
                    type="number"
                    min="0"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            {/* Spouse Selection */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Do you have a spouse?</label>
                <select
                    value={hasSpouse}
                    onChange={(e) => setHasSpouse(e.target.value === 'true')}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
            </div>

            {/* Dependents Input */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Number of Dependents:</label>
                <input
                    type="number"
                    min="0"
                    value={dependents}
                    onChange={(e) => {setDependents(e.target.value)}}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button 
                    onClick={onSubmit} 
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#000',
                        color: '#fff',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default UserDetailsPage;
