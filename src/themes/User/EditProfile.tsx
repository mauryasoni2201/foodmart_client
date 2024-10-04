import React from "react";
import Section from "../../components/Section/Section";
import Cookies from "js-cookie";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import Avatar from "react-avatar";
import Button from "../../components/Button/Button";
import * as yup from "yup";
import Swal from "sweetalert2";
import EditUserDetails from "../../models/EditUserDetails";
import UserInformation from "../../models/UserDetails";
import FormInput from "../../components/FormInput/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { backendUrl, client, getAllData, sendRequest } from "../../utils/request";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../Common.css";
import "../Form.css";

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const {data,isLoading,isError,error} = useQuery({
    queryKey:['user'],
    queryFn:()=>getAllData(`${backendUrl}/api/user-details`,{
      headers:{
        'Authorization':`Bearer ${Cookies.get('token')}`
      }
    })
  });
  const {mutate:updateMutate,isPending:updateIsPending} = useMutation({mutationFn:sendRequest,
    onSuccess(response){
      if(response.statusCode===200){
        Swal.fire({
          title: `User details updated.`,
          icon: "success",
          willClose(){
            client.invalidateQueries({queryKey:['user']});
            navigate('/');
          }
        });
      }
    },
    onError(error:any){
      if(error.message==="Unauthorized user"||error.message==="Token is required."||error.message==="jwt malformed"){
        Swal.fire({
          icon: "error",
          title: "Error Occured.",
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
  const validation = new yup.ObjectSchema({
    name:yup.string().min(2).required(),
    email:yup.string().email().required(),
    address:yup.string().min(5).required(),
    mobile:yup.string().min(10).max(10).required(),
    photo:yup.mixed().required()
  });
  const {register:updateRegister,handleSubmit:handleUpdateSubmit,formState:{errors}} = useForm({resolver:yupResolver(validation)});
  const handleUpdateForm=(data:EditUserDetails)=>{
    const formData = new FormData();
    formData.append('photo',data.photo[0]);
    for(const key in data){
      const value = data[key as keyof EditUserDetails];
      if(key!=='photo'){
        formData.append(key,value);
      }
    }
    updateMutate({
      url:`${backendUrl}/api/update-userdetails`,
      configuration:{
        method:"PUT",
        headers:{
          'Authorization':`Bearer ${Cookies.get('token')}`
        },
        body:formData
      }
    }) 
  }
  let content;
  if(isError){
    content = <Error message={error.message}/>;
  }
  if(isLoading){
    content = <Loader/>;
  }
  if(data){
    const userDetails:UserInformation =  data;
    content = <div className="edit-profile">
      <div className="update-photo">
       {!userDetails.image?<Avatar className="avatar-design" name={userDetails.name}/>:
       <img loading='lazy' src={`${backendUrl}/public/uploads/users/${userDetails.image}`} width={"150px"} height={"100px"} alt={userDetails.name}/>}
      </div>
      <div className="form update-form">
      <form onSubmit={handleUpdateSubmit(handleUpdateForm as any)}>
          <FormInput type="text" defaultValue={userDetails.name??""} placeholder="Enter Your Name" register={updateRegister("name")} errors={errors.name}/>
          <FormInput type="email" defaultValue={userDetails.email??""} placeholder="Enter Your Email" register={updateRegister("email")} errors={errors.email}/>
          <FormInput type="number" defaultValue={userDetails.mobile??""} placeholder="Enter Your MobileNumber" register={updateRegister("mobile")} errors={errors.mobile}/>
          <FormInput textArea placeholder="Enter Your Address" register={updateRegister("address")} defaultValue={userDetails.address??""} errors={errors.address}/>
          <div className='input-wrapper photo'>
            <label>Update your photo</label>
            <input className='others' type='file' {...updateRegister("photo")}/>
            {errors.photo?.message&&<p className='validation-errors'>{errors.photo.message}</p>}
          </div>
          {!updateIsPending&&<div style={{display:"flex",justifyContent:"center"}} className='input-wrapper'>
            <Button type='submit'>Update Profile</Button>
          </div>}
          {updateIsPending&&<div className='input-wrapper'>
            <p className='validation-errors'>Updating Profile....</p>
          </div>}
      </form>
      </div>
    </div>
  }
  return (<Section heading='Edit Profile'>  
  {content}
  </Section>);
};

export default EditProfile;