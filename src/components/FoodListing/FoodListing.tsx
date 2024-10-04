import React, { ReactNode } from 'react';
import "./FoodListing.css";

const FoodListing:React.FC<{children:ReactNode,center?:boolean}>= ({children,center}) => {
  return (
    <ul className='foodlisting' style={{justifyContent:center?"center":"start"}}>
        {children}
    </ul>
  )
}

export default FoodListing;
