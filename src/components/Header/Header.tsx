import React, { ReactNode, useState } from "react";
import Avatar from "react-avatar";
import logo from "../../images/logo-no-background.png";
import hamburger from "../../images/hamburger.png";
import closeButton from "../../images/closebtn.png";
import Button from "../Button/Button";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {Link, useNavigate ,Form} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {backendUrl, getAllData } from "../../utils/request";
import "./Header.css";

const Header: React.FC<{children:ReactNode}>= ({children}) => {
  const [open,setOpen] = useState<boolean>(false);
  const handleHeader=()=>{
    setOpen((prev)=>prev=!prev);
  }
  const navigate = useNavigate();
  const [menu,setMenu] = useState(false);
  const {data,isError,error} = useQuery({
    queryKey:['user'],
    queryFn:()=>getAllData(`${backendUrl}/api/user-details`,{
    headers:{
      'Authorization':`Bearer ${Cookies.get('token')}`
    }
  }
),
   enabled:(typeof Cookies.get("token")==="string")
});
if(isError){
  if(error.message==="Your account is deactivated please contact to admin."){
    Swal.fire({
      icon: "error",
      title: `Your account has been deactivated by admin.`
    });
    Cookies.remove('token');
    Cookies.remove("role");
    navigate("/login");
  }
}
  const handleNavigation=():void=>{
    navigate('/login');
  }
  const handleLogout=():void=>{
    Swal.fire({
      title: `Logout successfully.`,
      icon: "success",
    });
  }
  const handleMenu=():void=>{
    setMenu((prev)=>!prev);
  }
  return (
    <header>
      <div className="header-content">
        <div className="container">
          <div className="header-content-wrapper">
            <div className="website-logo">
              <Link to="">
                <img src={logo} alt="logo" height={"60px"} width={"150px"} />
              </Link>
            </div>
            <div className="togglebutton">
              {!open?<img onClick={handleHeader} src={hamburger} height={"40px"} width={"40px"} alt="hamburger"/>
              :<img onClick={handleHeader} src={closeButton} height={"40px"} width={"40px"} alt="closebutton"/>}
            </div>
            <div className={`header-menu ${open?"open":"close"}`}>
              <nav>
                <ul>
                  {children}
                </ul>
               </nav>
              </div>
              {Cookies.get('token')?
              <div className={`menu-container ${open?"open":"close"}`}>
              {data&&data.image&&<img style={{cursor:"pointer",borderRadius:"50%"}} onClick={handleMenu} alt={data.name} src={`${backendUrl}/public/uploads/users/${data.image}`} height={"50px"} width={"50px"}/>}
              {data&&!data.image&&<Avatar onClick={handleMenu}style={{cursor:"pointer"}} className='avatar-design no-profile-photo' name={data.name} />}
              {menu?<div className="menu-options">
              <div style={{borderTopLeftRadius:"4px",borderTopRightRadius:"4px"}} className="menu-option">
                <Link style={{color:"black"}} onClick={handleMenu} to={'edit-profile'}>Edit Profile</Link>
              </div>
              <div style={{borderBottomLeftRadius:"4px",borderBottomRightRadius:"4px",borderTop:"1px solid #B5C0D0"}} className="menu-option">
              <Form method="post" action="/logout">
              <Button className="logout-button" onClick={handleLogout}>Logout</Button>
              </Form>
              </div>
              </div>:null}
              </div>:<div className={`login-signup ${open?"open":"close"}`}>
              <Button onClick={handleNavigation}>Login/Signup</Button>
              </div>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

