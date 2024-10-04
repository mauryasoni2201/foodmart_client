import React from 'react';
import Section from '../../../components/Section/Section';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import * as yup from "yup";
import Button from '../../../components/Button/Button';
import AddUserDetails from '../../../models/AddUser';
import FormInput from '../../../components/FormInput/FormInput';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { backendUrl, client, sendRequest } from '../../../utils/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import "../../Form.css";

const AddUser:React.FC=()=>{
  const navigate = useNavigate();
  const validation = yup.object().shape({
    name:yup.string().min(2).required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    mobile:yup.string().min(10).max(10).required(),
    gender:yup.string().required('Please select a gender.')
  });
  const {mutate,isPending} = useMutation({
    mutationFn:sendRequest,
    onSuccess(response){
    if(response.statusCode===201){
        Swal.fire({
            title: `${response.data.message}`,
            icon: "success",
            willClose(){
              reset();
              client.invalidateQueries({queryKey:['users']});
              navigate('/admin/users');
            }
        });
    }else if(response.statusCode===200){
            Swal.fire({
              icon: "error",
              title: "Email already exists."
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
                Cookies.remove('token');
                navigate('/login');
              }
            });}else{
              Swal.fire({
                icon: "error",
                title: "Error Occured.",
                text: `${error.message}`,
              });
            }
    }
  });
 const {register,handleSubmit,formState:{errors},reset} = useForm({resolver:yupResolver(validation)});
 const handleAddUser=(data:AddUserDetails):void=>{
    mutate({
        url:`${backendUrl}/api/users`,
        configuration:{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                'Content-type':"application/json",
                'Authorization':`Bearer ${Cookies.get("token")}`
            }
        }
    })
}
  return (
    <Section heading='Add User'>
        <div className='back-wrapper'>
            <Button onClick={()=>navigate('/admin/users')}>Back</Button>
        </div>
      <div className='form'>
        <form onSubmit={handleSubmit(handleAddUser as any)}>
          <FormInput addForm type="text" placeholder="Enter Your Name" register={register("name")} errors={errors.name}/>
          <FormInput addForm type="email" placeholder="Enter Your Email" register={register("email")}errors={errors.email}/>
          <FormInput addForm type="password" placeholder="Enter Your Password" register={register("password")} errors={errors.password}/>
          <FormInput addForm type="number" placeholder="Enter Your MobileNumber" register={register("mobile")} errors={errors.mobile}/>
           <div className='input-wrapper'>
            <select {...register("gender")}>
            <option value={''}>Please select an gender</option>
            <option value={'male'}>Male</option>
            <option value={'female'}>Female</option>
            </select>
          {errors.gender?.message&&<p className='validation-errors'>{errors.gender.message}</p>}
          </div>
          {!isPending&&<div className='input-wrapper'>
            <Button type='submit'>Add User</Button>
          </div>}
          {isPending&&<div className='input-wrapper'>
            <p className='validation-errors'>Submitting....</p>
          </div>}
        </form>
      </div>
    </Section>
  )
}

export default AddUser;
