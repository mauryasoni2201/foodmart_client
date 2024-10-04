import React, {useCallback, useState,useMemo,useRef} from 'react';
import Section from '../../components/Section/Section';
import Cookies from 'js-cookie';
import Error from '../../components/Error/Error';
import Loader from '../../components/Loader/Loader';
import DataTable from 'react-data-table-component';
import Avatar from 'react-avatar';
import Button from '../../components/Button/Button';
import Swal from 'sweetalert2';
import debounce from 'lodash.debounce';
import Search from '../../components/Search/Search';
import UsersListing from '../../models/UserListing';
import { useMutation, useQuery } from '@tanstack/react-query';
import { backendUrl,client,getAllData, sendRequest } from '../../utils/request';
import { Link, useNavigate } from 'react-router-dom';
import "./Admin.css";

const Users:React.FC = () => {
  const navigate = useNavigate();
  const handleAddUser=()=>{
    navigate('/admin/adduser');
  }
  const searchTerm = useRef<HTMLInputElement|any>(null);
  const [search,setSearch] = useState<string>('');
  const {data,isLoading,isError,error} = useQuery({
    queryKey:['users',search],
    queryFn:()=>getAllData(`${backendUrl}/api/users?search=${search}`,{
      headers:{
        'Authorization':`Bearer ${Cookies.get('token')}`
      }
    })
  }); 
  const {mutate:statusMutate} = useMutation({
    mutationFn:sendRequest,
    onSuccess(response){
      if(response.statusCode===200){
        Swal.fire({
          title: `User status updated.`,
          icon: "success",
          willClose(){
            client.invalidateQueries({queryKey:['users']});
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
  const handleUserStatus=(_id:string,status:Boolean)=>{
    statusMutate({
      url:`${backendUrl}/api/users/${_id}`,
      configuration:{
        method:"PUT",
        body:JSON.stringify({
          userStatus:status?false:true
        }),
        headers:{
          'Content-type':"application/json",
          'Authorization':`Bearer ${Cookies.get('token')}`
        }
      }
    })
  }
  const dispatchDebounced = useMemo(() => debounce((value: string) => {
      setSearch(value);
  }, 1000), []);

  const handleSearch = useCallback(() => {
    dispatchDebounced(searchTerm.current.value);
  }, [dispatchDebounced]);
  let content;
  if(isError){
    content = <Error message={error.message}/>;
  }
  if(isLoading){
    content = <Loader/>;
  }
  if(data){ 
    const filteredData:UsersListing[] = data.filter((element:any)=>element.role!=="admin");
    const columns:any = [
      {
        name:"Image",
        selector:((row:any)=>row.image?<img loading='lazy' src={`${backendUrl}/public/uploads/users/${row.image}`} width={"100px"} height={"100px"} alt={row.name}/>:<Avatar className='avatar-design' name={row.name} />)
      },
      {
        name:'Name',
        selector:((row:any)=>row.name.charAt(0).toUpperCase()+row.name.slice(1)),
        sortable:true
      },
      {
        name:'Email',
        selector:((row:any)=>row.email),
        sortable:true
      },
      {
        name:"EmailVerified",
        selector:((row:any)=>row.isUser?"Yes":"No")
      },
      {
        name:'User Status',
        cell:(row:any)=>(
          <label className="switch">
          <input type="checkbox" onChange={()=>handleUserStatus(row._id,row.userStatus)} checked={row.userStatus}/>
          <span className="slider round"></span>    
        </label>
        )
      },
      {
        name:"User Details",
        cell:(row:any)=>(
          <Link to={row._id}>
          <Button>View Details</Button>
          </Link>
        )
      } 
    ]
    content = <>
    {data.length===0?<div className='nocontent-text'><p>No users available.</p></div>:<DataTable data={filteredData} columns={columns} pagination/>}
    </>
  }
  return (<Section heading="Users">
      <div style={{ paddingBottom: "20px" }} className="add-food-item-button space">
        <Button onClick={handleAddUser}>Add User</Button>
        <Search ref={searchTerm} onChange={handleSearch} />
      </div>
      {content}
    </Section>);
}

export default Users;
