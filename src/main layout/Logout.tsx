import Cookies from "js-cookie";
import { redirect } from "react-router-dom";

export default function action(){
    Cookies.remove('token');
    Cookies.remove('role');
    return redirect('/login');
}