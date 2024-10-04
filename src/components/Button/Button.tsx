import React from 'react';
import "./Button.css";
import ButtonProps from '../../models/ButtonProps';

const Button:React.FC<ButtonProps>=({children,...props}) => {
    return <button {...props}>{children}</button>;
}

export default Button;
