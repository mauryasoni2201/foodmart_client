import React from "react";
import logo from "../../images/logo-no-background.png";
import * as yup from "yup";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import AddUserDetails from "../../models/AddUser";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { backendUrl, sendRequest } from "../../utils/request";
import "../Account.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigate=():void=>{
    navigate('/login');
  }
  const {isPending,mutate} = useMutation({mutationFn:sendRequest,
    onSuccess(response){
      if(response.statusCode === 201) {
        Swal.fire({
          title: `${response.data.message}`,
          text: "Check your email for an OTP to verify your account.",
          icon: "success",
          willClose(){
            reset();
            Cookies.set('token',response.data?.token,{ expires: 1});
            navigate('/verifyuser');
          }
        });
      }
    },
    onError(error){
      Swal.fire({
        icon: "error",
        title: "Error Occured.",
        text: `${error.message}`,
      });
    }
  }); 
  const validation = yup.object().shape({
    name:yup.string().min(2).required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    mobile:yup.string().min(10).max(10).required(),
    gender:yup.string().required('Please select an gender.')
  });
  const { register, handleSubmit, formState: { errors }, reset } = useForm({resolver:yupResolver(validation)});
  const handleRegister = (data:AddUserDetails): void => {
    mutate({
      url: `${backendUrl}/api/register`,
      configuration: {
        method: "POST",
        body: JSON.stringify(data), 
        headers: {
          'Content-Type': "application/json",
        }
      },
    });
  }
  return (
    <div className="form-container">
      <div className="form-wrapper">
          <form onSubmit={handleSubmit(handleRegister as any)}>
            <div className="logo">
            <img height={'60px'} width={'150px'} src={logo} alt={'Logo'}/>
            </div>
            <div className="heading">
                 <h1>REGISTRATION</h1>
            </div>
              <FormInput type="text" placeholder="Enter Your Name" register={register("name")} errors={errors.name}/>
              <FormInput type="email" placeholder="Enter Your Email" register={register("email")}errors={errors.email}/>
              <FormInput type="password" placeholder="Enter Your Password" register={register("password")} errors={errors.password}/>
              <FormInput type="number" placeholder="Enter Your MobileNumber" register={register("mobile")} errors={errors.mobile}/>
              <div className="input-wrapper">
              <select {...register("gender")} style={{borderBottom:"none"}}>
                <option value={''}>Select Your Gender</option>
                <option value={'male'}>Male</option>
                <option value={'Female'}>Female</option>
              </select>
              {errors.gender?.message&&<p className="form-error-text">{errors.gender.message}</p>}
            </div>
            {!isPending&&<Button type="submit" style={{width:"100%"}}>Register</Button>}
            {isPending&&<div className="form-navlink">
              <p>Submitting....</p>
            </div>}
            <div className="form-navlink">
              <p>Have an account? <span onClick={handleNavigate}>Log in </span></p>
            </div>
          </form>
      </div>
    </div>
  );
};

export default Signup;
