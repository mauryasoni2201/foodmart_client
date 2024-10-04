import React from 'react';
import Avatar from 'react-avatar';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Error from '../../components/Error/Error';
import Loader from '../../components/Loader/Loader';
import Detail from '../../components/Detail/Detail';
import Section from '../../components/Section/Section';
import Button from '../../components/Button/Button';
import FoodDetails from '../../models/FoodDetails';
import { Box, Rating } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { backendUrl, client, getAllData, sendRequest } from '../../utils/request';
import "./ViewUserDetails/ViewUserDetails.css";
import "../Common.css";

const UserDetails:React.FC = () => {
   const navigate = useNavigate();
   const {id} = useParams();
   const {mutate,isPending} = useMutation({mutationFn:sendRequest,
    onSuccess(response){
      if(response.statusCode===200){
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          willClose(){
            client.invalidateQueries({queryKey:['foods']});
            navigate('/admin')
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
  });
  const handleRemoveFood=(_id:string)=>{
    mutate({
      url:`${backendUrl}/api/foods/${_id}`,
      configuration:{
        method:"DELETE",
        headers:{
          'Authorization':`Bearer ${Cookies.get('token')}`
        }
      }
    })
  }
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
   if(data){ 
    const itemDetails:FoodDetails = data;
    content =  <>
    <div className='back-wrapper'>
    <Button onClick={()=>navigate('/admin')}>Back</Button>
    </div>
    <div className="edit-profile">
    <div className='view-details-wrapper'>
        <div className='view-details'>
            {itemDetails.image?<img loading='lazy' src={`${backendUrl}/public/uploads/foods/${data.image}`} width={"100px"} height={"100px"} alt={data.name}/>:<Avatar className='avatar-design' name={data.name} />}
            <Detail fieldName={"Name"} fieldValue={itemDetails.name.charAt(0).toUpperCase()+itemDetails.name.slice(1)}/>
            <Detail fieldName={"Category"} fieldValue={itemDetails.category.charAt(0).toUpperCase()+itemDetails.category.slice(1)}/>
            <Detail fieldName={"Price"} fieldValue={ `₹${itemDetails.price}`}/>
            <Detail isAddress  fieldName={"Description"} fieldValue={itemDetails.description.trim().length===0?"Not-Set":data.description}/>
            <Detail  fieldName={"Rating"} fieldValue={
              <Box sx={{ '& > legend': { mt: 2 } }}>
               <Rating name="rating" value={itemDetails.averageRating} precision={0.5} readOnly/>
               </Box>}
            />
            <div className='admin-actions'>
                <Link to={`edit`}><Button>Edit</Button></Link>
              {!isPending&&<Button onClick={()=>handleRemoveFood(itemDetails._id)}>Delete</Button>}
              {isPending&&<div className='nocontent-text'><p>Deleting FoodItem....</p></div>}
            </div>
        </div>
    </div>
    </div>
    </>
   }
  return (<Section heading='Food Details'>
        {content}
    </Section>);
}

export default UserDetails;
