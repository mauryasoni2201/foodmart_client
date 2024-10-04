import React from 'react';
import "./Error.css";

const Error:React.FC<{message:string|any}>= ({message}) => {
    return (
    <div className='error-message'>
        <div className='container'>
            <div className='error-main'>
            <div className='error-wrapper'>
                <div className='error-title'>
                <h2>An error occurred.</h2>
                </div>
                <div className='error-message'>
                <p>{message}</p>
                </div>
            </div>
            </div>
        </div>
    </div>
    )
}

export default Error;
