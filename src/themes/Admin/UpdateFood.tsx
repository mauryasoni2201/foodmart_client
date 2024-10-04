import React from "react";
import Cookies from "js-cookie";
import Avatar from "react-avatar";
import Swal from "sweetalert2";
import Section from "../../components/Section/Section";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import Error from "../../components/Error/Error";
import * as yup from "yup";
import FoodDetails from "../../models/FoodDetails";
import FormInput from "../../components/FormInput/FormInput";
import categories from "../../utils/category";
import {backendUrl,getAllData,client,sendRequest} from "../../utils/request";
import {yupResolver} from "@hookform/resolvers/yup";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import "../Common.css";
import "../Form.css";

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const {data,isLoading,isError,error} = useQuery({
    queryKey:['foods',id],
    queryFn:()=>getAllData(`${backendUrl}/api/foods/${id}`,{
      headers:{
        'Authorization':`Bearer ${Cookies.get('token')}`
      }
    })
  });
  let content;
  if(isError){
    content = <Error message={error.message}/>;
  }
  if(isLoading){
    content = <Loader/>;
  }
  const {mutate:updateMutate,isPending:updateIsPending} = useMutation({mutationFn:sendRequest,
    onSuccess(response){
      if(response.statusCode===200){
        Swal.fire({
          title: `Food details updated.`,
          icon: "success",
          willClose(){
            client.invalidateQueries({queryKey:['foods']});
            navigate('/admin');
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
    description:yup.string().min(2).required(),
    price:yup.string().min(2).required(),
    category:yup.string().min(2).required(),
    photo:yup.mixed().required()
  });
  const {register:updateRegister,handleSubmit:handleUpdateSubmit,formState:{errors}} = useForm({resolver:yupResolver(validation)});
  const handleUpdateForm=(data:any)=>{
    const formData = new FormData();
     formData.append('photo',data.photo[0]);
    for(const key in data){
      if(key!=='photo'){
        formData.append(key,data[key]);
      }
    }
    updateMutate({
      url:`${backendUrl}/api/foods/${id}`,
      configuration:{
        method:"PUT",
        headers:{
          'Authorization':`Bearer ${Cookies.get('token')}`
        },
        body:formData
      }
    }) 
  }
  if(data){
    let foodInformation:FoodDetails = data;
    content = <div className="edit-profile">
      <div className="update-photo">
       {!data.image?<Avatar className="avatar-design" name={data.name}/>:
       <img loading='lazy' src={`${backendUrl}/public/uploads/foods/${data.image}`} width={"150px"} height={"100px"} alt={data.name}/>}
      </div>
      <div className="form update-form">
      <form onSubmit={handleUpdateSubmit(handleUpdateForm)}>
        <FormInput defaultValue={foodInformation.name??""} type='text' placeholder='Enter Food Name' errors={errors.name} register={updateRegister("name")}/>
        <FormInput defaultValue={foodInformation.price??""} type='number' placeholder='Enter Food Price' errors={errors.price} register={updateRegister("price")}/>
        <FormInput defaultValue={foodInformation.description??""} textArea placeholder='Enter Food Description' register={updateRegister("description")} errors={errors.description} />
        <div className='input-wrapper'>
            <select defaultValue={foodInformation.category??""} {...updateRegister("category")}>
            <option value={''}>Please select an category</option>
            {categories.map((element)=>{
              return <option value={element.value}>{element.value.charAt(0).toUpperCase()+element.value.slice(1)}</option>
            })}
            </select>
            {errors.category?.message&&<p className='validation-errors'>{errors.category.message}</p>}
          </div>
        <div className='input-wrapper photo'>
            <label>Update photo</label>
            <input className='others' type='file' {...updateRegister("photo")}/>
            {errors.photo?.message&&<p className='validation-errors'>{errors.photo.message}</p>}
          </div>
          {!updateIsPending&&<div style={{display:"flex",justifyContent:"center"}} className='input-wrapper'>
            <Button type='submit'>Update Food</Button>
          </div>}
          {updateIsPending&&<div className='input-wrapper'>
            <p className='validation-errors'>Updating Food details....</p>
          </div>}
      </form>
      </div>
    </div>
  }
  return (<Section heading='Update Food Details'>  
  {content}
  </Section>);
};

export default EditProfile;