import React from "react";
import Header from "../components/Header/Header";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";

const AdminRootLayout: React.FC = () => {
  return (
    <>
      <Header>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/admin"
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="users"
          >
            Users
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="orders"
          >
            Orders
          </NavLink>
        </li>
      </Header>
      <Outlet/>
      <Footer/>
    </>
  );
};
export default AdminRootLayout;
