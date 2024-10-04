import React from "react";
import * as yup from "yup";
import Swal from "sweetalert2";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import Cookies from "js-cookie";
import logo from "../../images/logo-no-background.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { backendUrl, sendRequest } from "../../utils/request";
import "../Account.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigate=():void=>{
    navigate('/register');
  }
  const handleForgotPasswordNavigation=():void=>{
      navigate('/forgotpassword');
  }
  const validation = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).required()
  });
  const {isPending,mutate} = useMutation({
    mutationFn:sendRequest,
    onSuccess(response){
      if(response.statusCode===200&&response.data.role==="admin"){
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          willClose(){
            reset();
            Cookies.set('token',response.data.token,{ expires: 1});
            Cookies.set('role',response.data.role,{ expires: 1});
            navigate('/admin');
          }
        });
      }else if(response.statusCode===200&&response.data.role==="user"){
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          willClose(){
            reset();
            Cookies.set('token',response.data.token,{ expires: 1});
            Cookies.set('role',response.data.role,{ expires: 1});
            navigate('/');
          }
        });
      }
    },
    onError(error:any){
      Swal.fire({
        icon: "error",
        title: "Error Occured.",
        text: `${error.message}`,
      });
    }
  });
  const {register, handleSubmit, formState: { errors }, reset} = useForm({resolver:yupResolver(validation)});
  const handleLogin=(data:{email:string,password:string}):void=>{
    mutate({
    url:`${backendUrl}/api/login`,
    configuration:{
      method:"POST",
      body:JSON.stringify(data),
      headers:{
        "Content-type":"application/json"
      }
    }})}
  return (
    <div className="form-container">
      <div className="form-wrapper">
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="logo">
              <img height={'60px'} width={'150px'} src={logo} alt={'Logo'}/>
            </div>
            <div className="heading">
                <h1>LOGIN</h1>
            </div>
            <FormInput errors={errors.email} type="email" placeholder="Enter Your Email" register={register("email")}/>
            <FormInput errors={errors.password} type="password" placeholder="Enter Your Password" register={register("password")}/>
            {isPending&&<div className="form-navlink">
              <p>Submitting....</p>
            </div>}
            {!isPending&&<Button type="submit" style={{width:"100%"}}>Login</Button>}
            <div className="form-navlink">
              <p className="forgot-password"><span onClick={handleForgotPasswordNavigation}>Forgot Password?</span></p>
              <p>Don't have an account? <span onClick={handleNavigate}>Register</span></p>
            </div>
          </form>
      </div>
    </div>
  );
}
export default Login;
