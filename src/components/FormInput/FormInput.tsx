import React from 'react';

const FormInput:React.FC<{placeholder:string,type?:string,register:object,errors:any,defaultValue?:any,textArea?:boolean,addForm?:boolean}>= ({placeholder,type,register,errors,defaultValue,textArea,addForm}) => {
  return (
   <div className='input-wrapper'>
     {textArea?<textarea placeholder={placeholder} style={{height:"unset"}} rows={3} {...register} defaultValue={defaultValue} />:<input type={type} placeholder={placeholder} {...register} defaultValue={defaultValue}/>}
     {addForm||defaultValue?<p className='validation-errors'>{errors?.message}</p>:<p className="form-error-text">{errors?.message}</p>}
   </div>
  )
}

export default FormInput;
