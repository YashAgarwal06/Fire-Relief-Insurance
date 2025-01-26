import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const SummarizePage = () => {
    const location = useLocation();
    const { pdfResult, zipResult } = location.state || {};

    if (!pdfResult || !zipResult) {
        return (
            <div>
                <h1>Error</h1>
                <p>Missing results. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Summarized Results</h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">PDF Result:</h2>
                <ReactMarkdown>{pdfResult}</ReactMarkdown>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4">ZIP Result:</h2>
                <ReactMarkdown>{zipResult}</ReactMarkdown>
            </div>
        </div>
    );
};

export default SummarizePage;

