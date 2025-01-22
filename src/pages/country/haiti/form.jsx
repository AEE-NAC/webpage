import React from 'react';

const HaitiForm = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-50">
            <iframe
                src="YOUR_GOOGLE_FORM_URL_HERE"
                className="w-full h-full border-none"
                title="Haiti Form"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
            >
                Loading...
            </iframe>
        </div>
    );
};

export default HaitiForm;