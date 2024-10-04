import React from 'react';
import './Footer.css';
;
const Footer:React.FC = () => {
    return (
    <footer>
        <div className='container'>
            <div className='footer-content'>
                <div className='footer-text'>
                <p style={{color:'black'}} className='footer-text'>© 2024 FoodMart | MS. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
    );
}

export default Footer;
