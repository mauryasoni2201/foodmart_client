import React from 'react';
import Error from '../../../components/Error/Error';
import Loader from '../../../components/Loader/Loader';
import Avatar from 'react-avatar';
import Detail from '../../../components/Detail/Detail';
import Section from '../../../components/Section/Section';
import Button from '../../../components/Button/Button';
import UserInformation from '../../../models/UserDetails';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { backendUrl, client, getAllData, sendRequest } from '../../../utils/request';
import "./ViewUserDetails.css";
import "../../Common.css";

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
            client.invalidateQueries({queryKey:['users']});
            navigate('/admin/users')
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
  const handleRemoveUser=(_id:string)=>{
    mutate({
      url:`${backendUrl}/api/users/${_id}`,
      configuration:{
        method:"DELETE",
        headers:{
          'Authorization':`Bearer ${Cookies.get('token')}`
        }
      }
    })
  }
   const {data,isLoading,isError,error} = useQuery({
    queryKey:['user',id],
    queryFn:()=>getAllData(`${backendUrl}/api/users/${id}`,{
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
    const userDetails:UserInformation = data;
    content =  <>
    <div className='back-wrapper'>
    <Button onClick={()=>navigate('/admin/users')}>Back</Button>
    </div>
    <div className="edit-profile">
    <div className='view-details-wrapper'>
        <div className='view-details'>
            {userDetails.image?<img loading='lazy' src={`${backendUrl}/public/uploads/users/${userDetails.image}`} width={"100px"} height={"100px"} alt={userDetails.name}/>:<Avatar className='avatar-design' name={userDetails.name} />}
            <Detail fieldName={"Name"} fieldValue={userDetails.name.charAt(0).toUpperCase()+userDetails.name.slice(1)}/>
            <Detail fieldName={"Gender"} fieldValue={userDetails.gender.charAt(0).toUpperCase()+userDetails.gender.slice(1)}/>
            <Detail fieldName={"Email"} fieldValue={userDetails.email}/>
            <Detail fieldName={"Mobile"} fieldValue={userDetails.mobile}/>
            <Detail isAddress  fieldName={"Address"} fieldValue={userDetails.address.trim().length===0?"Not-Set":userDetails.address}/>
            <div className='admin-actions'>
              <Link to={`edit`}><Button>Edit</Button></Link>
              {!isPending&&<Button onClick={()=>handleRemoveUser(userDetails._id)}>Delete</Button>}
              {isPending&&<div className='nocontent-text'><p>Deleting user....</p></div>}
            </div>
        </div>
    </div>
    </div>
    </>
   }
  return (
    <Section heading='User Details'>
        {content}
    </Section>
  )
}

export default UserDetails;