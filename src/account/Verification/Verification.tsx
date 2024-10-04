import React from "react";
import * as yup from "yup";
import logo from "../../images/logo-no-background.png";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { backendUrl, sendRequest } from "../../utils/request";
import "../Account.css";

const Verification:React.FC = () => {
  const navigate = useNavigate();
  const validation = yup.object().shape({
    otp:yup.string().required()
  });
  const {register, handleSubmit, formState: { errors }, reset} = useForm({resolver:yupResolver(validation)});
  const {mutate,isPending} = useMutation({mutationFn:sendRequest,
    onSuccess(response){
        if(response.statusCode===200){
          Swal.fire({
            icon: "success",
            title: `${response.data.message}`,
            willClose(){
              reset();
              Cookies.remove('token');
              navigate('/login');
            }
          });
        }
    },
    onError(error:any){
      if(error.message==="Unauthorized user"||error.message==="Token is required."||error.message==="jwt malformed"){
        Swal.fire({
          icon: "error",
          title: "Error Occured!",
          text: `Not allowed`,
          willClose(){
            reset();
            Cookies.remove('token');
            navigate('/register');
          }
        });
      }else{
      Swal.fire({
        icon: "error",
        title: "Error Occured!",
        text: `${error.message}`,
      });
    }}
  });
  
  const handleVerfiyUser=(data:{otp:number|any}):void=>{
    mutate({
      url:`${backendUrl}/api/verify`,
      configuration:{
          method:"POST",
          body:JSON.stringify({otp:parseInt(data.otp)}),
          headers:{
            'Content-type':"application/json",
            'Authorization':`Bearer ${Cookies.get('token')}`
          }
      }
    })
}
  return (
    <div className="form-container">
      <div className="form-wrapper">
          <form onSubmit={handleSubmit(handleVerfiyUser as any)}>
            <div className="logo">
            <img height={'60px'} width={'150px'} src={logo} alt={'Logo'}/>
            </div>
            <div className="heading">
                <h1>USER VERIFICATION</h1>
            </div>
            <FormInput type="number" placeholder="Enter Your Otp" register={register("otp")} errors={errors.otp}/>
            {isPending&&<div className="form-navlink">
              <p>Submitting....</p>
            </div>}
          {!isPending&&<Button type="submit" style={{width:"100%"}}>Verify Otp</Button>}
          </form>
      </div>
    </div>
  );
}
export default Verification;