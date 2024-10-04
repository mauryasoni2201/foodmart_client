import React from 'react';
import Section from '../../../components/Section/Section';
import Swal from 'sweetalert2';
import Button from '../../../components/Button/Button';
import Cookies from 'js-cookie';
import * as yup from "yup";
import FormInput from '../../../components/FormInput/FormInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { backendUrl, client, sendRequest } from '../../../utils/request';
import "../../Form.css";
import categories from '../../../utils/category';

const FoodForm:React.FC = () => {
  const navigate = useNavigate();
  const validation = yup.object().shape({
    name: yup.string().min(2).required(),
    price:yup.number().typeError('Price must be a number').required('Price is required').nullable(),
    description:yup.string().min(2).required(),
    category:yup.string().min(2).required(),
    photo: yup.mixed().test('required','Please upload an image',(value:any)=>{
      return value&&value.length;
    })
  });
  const {register,handleSubmit,formState:{errors},reset} = useForm({resolver:yupResolver(validation)});
  const {isPending,mutate} = useMutation({
    mutationFn:sendRequest,
    onSuccess(response){
      if(response.statusCode===201){
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          willClose(){
            reset();
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
  })
  const handleData = (data:any) => {
    const formData = new FormData();
      formData.append('photo', data?.photo[0]);
      for (const key in data) {
        if (key !== 'photo') {
          formData.append(key, data[key]);
        }
      }
    mutate({
      url: `${backendUrl}/api/foods`,
      configuration: {
        method: "POST",
        body: formData,
        headers: {
          'Authorization':`Bearer ${Cookies.get('token')}`
        }
      }
    });
  };
  
  return (
    <Section heading='Add Food'>
       <div className='back-wrapper'>
            <Button onClick={()=>navigate('/admin')}>Back</Button>
          </div>
      <div className='form'>
        <form onSubmit={handleSubmit(handleData)}>
          <FormInput addForm type='text' placeholder='Enter Food Name' errors={errors.name} register={register("name")}/>
          <FormInput addForm type='number' placeholder='Enter Food Price' errors={errors.price} register={register("price")}/>
          <FormInput addForm textArea placeholder='Enter Food Description' register={register("description")} errors={errors.description} />
          <div className='input-wrapper'>
            <select {...register("category")}>
            <option value={''}>Please select an category</option>
            {categories.map((element)=>{
              return <option value={element.value}>{element.value.charAt(0).toUpperCase()+element.value.slice(1)}</option>
            })}
            </select>
            {errors.category?.message&&<p className='validation-errors'>{errors.category.message}</p>}
          </div>
          <div className='input-wrapper photo'>
            <label>Add Food Photo</label>
            <input className='others' type='file' {...register("photo")}/>
            {errors.photo?.message&&<p className='validation-errors'>{errors.photo.message}</p>}
          </div>
          {!isPending&&<div className='input-wrapper'>
            <Button type='submit'>Add Food</Button>
          </div>}
          {isPending&&<div className='input-wrapper'>
            <p className='validation-errors'>Submitting....</p>
          </div>}
        </form>
      </div>
    </Section>
  )
}

export default FoodForm;
