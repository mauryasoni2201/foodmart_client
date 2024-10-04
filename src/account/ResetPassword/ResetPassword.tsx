import React, { useRef, useState } from "react";
import * as yup from "yup";
import FormInput from "../../components/FormInput/FormInput";
import logo from "../../images/logo-no-background.png";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Button from "../../components/Button/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { backendUrl, sendRequest } from "../../utils/request";
import "../Account.css";

const ResetPassword:React.FC = () => {
  const navigate = useNavigate();
  let validation = useRef<Object|null>(null);
  const [current,setCurrent] = useState({email:true,otp:false,password:false});
  const emailValidation = yup.object().shape({
    email: yup.string().email().required()
  });
  const otpValidation = yup.object().shape({
    otp: yup.string().required()
  });
  const passwordValidation = yup.object().shape({
    password: yup.string().min(8).required()
  });
  if(current.email){
    validation.current=emailValidation;
  }else if(current.otp){
    validation.current=otpValidation;
  }else if(current.password){
    validation.current=passwordValidation;
  }
  const {mutate,isPending} = useMutation({mutationFn:sendRequest,
    onSuccess(response){
        if(response.statusCode===200){
        setCurrent((prev)=>{
          const updated = {...prev};
          updated.email=false;
          updated.otp=true;
          return updated;
        });
        Swal.fire({
          title: `Check your email for an OTP for reset password.`,
          icon: "success",
        });
        Cookies.set('token',response.data.token);
      }
    }
  ,onError(error){
    Swal.fire({
      icon: "error",
      title: "Error Occured.",
      text: `${error.message}`,
    });
  }});
  const {mutate:verifyOtpMutate,isPending:isVerifyingOtp} = useMutation({mutationFn:sendRequest,
      onSuccess(response){
        if(response.statusCode===200){
          setCurrent((prev)=>{
            const updated = {...prev};
            updated.otp=false;
            updated.password=true;
            return updated;
          });
          Swal.fire({
            icon: "success",
            title: `Please enter your password again.`
          });
        }
      },
      onError(error){
        if(error.message==="Unauthorized user"||error.message==="Token is required."||error.message==="jwt malformed"){
          Swal.fire({
            icon: "error",
            title: "Error Occured!",
            text: `Not allowed`,
            willClose(){
              reset();
              Cookies.remove('token');
              navigate('/login');
            }
          });
        }else{
        Swal.fire({
          icon: "error",
          title: "Error Occured.",
          text: `${error.message}`,
        });
      }}
  });
  const {mutate:resetPasswordMutate,isPending:isResetingPassword} = useMutation({mutationFn:sendRequest,
    onSuccess(response){
      if(response.statusCode===200){
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          willClose(){
            Cookies.remove('token');
            navigate('/login');
          }
        });
      }
    },
    onError(error){
      if(error.message==="Unauthorized user"||error.message==="Token is required."||error.message==="jwt malformed"){
        Swal.fire({
          icon: "error",
          title: "Error Occured!",
          text: `Not allowed`,
          willClose(){
            reset();
            Cookies.remove('token');
            navigate('/login');
          }
        });
      }
      else{
        Swal.fire({
        icon: "error",
        title: "Error Occured.",
        text: `${error.message}`,
      });
    }
    }
});
  const { register, handleSubmit, formState: { errors }, reset } = useForm({resolver:yupResolver(validation.current as any)});
  const handleForgotPassword=(data:{email?:string,otp?:number|any,password?:string}):void=>{
    if(current.email){
      mutate({
        url:`${backendUrl}/api/verify-email`,
        configuration:{
          method:"POST",
          body:JSON.stringify(data),
          headers:{
            'Content-type':"application/json"
          }
        }
      })
    }else if(current.otp){
      verifyOtpMutate({
        url:`${backendUrl}/api/verify-otp`,
        configuration:{
          method:"POST",
          body:JSON.stringify({otp:parseInt(data.otp)}),
          headers:{
            'Content-type':"application/json",
            'Authorization':`Bearer ${Cookies.get('token')}`
          }
        }
      })
    }else if(current.password){
        resetPasswordMutate({
          url:`${backendUrl}/api/forgot-password`,
          configuration:{
            method:"PUT",
            body:JSON.stringify(data),
            headers:{
              'Content-type':"application/json",
              'Authorization':`Bearer ${Cookies.get('token')}`
            }
          }
        })
    }
  }
  return (
    <div className="centered-content">
    <div className="form-container">
      <div className="form-wrapper">
          <form onSubmit={handleSubmit(handleForgotPassword as any)}>
            <div className="logo">
            <img height={'60px'} width={'150px'} src={logo} alt={'Logo'}/>
            </div>
            <div className="heading">
                <h1>RESET PASSWORD</h1>
            </div>
            {current.email&&<FormInput type="email" placeholder="Enter Your Email" register={register("email")} errors={errors.email}/>}
            {current.otp&&<FormInput type="number" placeholder="Enter Your Otp" register={register("otp")} errors={errors.otp}/>}
            {current.password&&<FormInput type="password" placeholder="Enter Your Password" register={register("password")} errors={errors.password} />}
            {!isPending||!isResetingPassword||!isVerifyingOtp?<Button type="submit" style={{width:"100%"}}>Submit</Button>:
            <div className="form-navlink">
              <p>Submitting....</p>
            </div>}
            <div className="form-navlink">
              <p><span onClick={()=>navigate('/login')}>Back to Login</span></p>
            </div>
          </form>
      </div>
      </div>
    </div>
  );
}

export default ResetPassword;
