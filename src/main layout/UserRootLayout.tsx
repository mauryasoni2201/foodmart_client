import React from "react";
import Header from "../components/Header/Header";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { FoodCart } from "../models/FoodCart";

const UserRootLayout: React.FC = () => {
  const foodCart:FoodCart[] = useSelector((state:any)=>state.foodcart.items);
  const quantity = foodCart.reduce((prev,next)=>prev+next.quantity,0);

  return (
    <>
      <Header>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/"
            end
          >
            Home
          </NavLink>
        </li>
        {Cookies.get('token')?<><li>
          <NavLink
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="cart"
          >
            View Cart ({quantity})
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="orders"
          >
            View Orders
          </NavLink>
        </li></> :null}
      </Header>
      <Outlet/>
      <Footer/>
    </>
  );
};

export default UserRootLayout;
