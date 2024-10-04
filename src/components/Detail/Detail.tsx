import React, { ReactNode } from 'react';
import "./Detail.css"

type DetailValue = string|ReactNode;

const Detail:React.FC<{fieldName:string,fieldValue:DetailValue,isAddress?:boolean}>= ({fieldName,fieldValue,isAddress}) => {
  return (
    <div className='user-detail' style={{maxWidth:isAddress?"400px":""}}>
     <h2 style={{textAlign:isAddress?"center":"unset"}}><b>{fieldName.toUpperCase()}</b><span>:</span>{fieldValue}</h2>
    </div>
  )
}

export default Detail;
