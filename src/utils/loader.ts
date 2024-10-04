import Cookies from "js-cookie";
import {redirect} from "react-router-dom";

export const loader=():Response|null=>{
  const token = Cookies.get('token');
    if(!token){
      return redirect('/register');
    }
    return null;
}

export const adminLoader = (): Response | null => {
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  if(!token){
    return redirect('/login');
  }
  if(role!=="admin"){
    return redirect('/login');
  }
  return null;
};

export const userLoader=():Response|null=>{
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  if(token&&role==="admin"){
    return redirect("/admin");
  }
  return null;
}

export const userOtherPage=():Response|null=>{
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  if(!token||!role){
    return redirect("/login");
  }
  return null;
}