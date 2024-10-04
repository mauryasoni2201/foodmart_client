import React, { ReactNode } from 'react';
import "./FoodItem.css";

const FoodItem:React.FC<{children:ReactNode,rating?:boolean}>= ({children,rating}) => {
  return (
    <li className={`food-item ${rating?'orders':''}`}>
      <div className='food-item-wrapper' style={{height:rating?"unset":"100%",borderTopLeftRadius:rating?"4px":"0px",borderTopRightRadius:rating?"4px":"0px"}}>
        {children}
      </div>
    </li>
  )
}

export default FoodItem;
