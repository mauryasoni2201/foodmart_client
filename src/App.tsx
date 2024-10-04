import Loader from "./components/Loader/Loader";
import action from "./main layout/Logout";
import UserRootLayout from "./main layout/UserRootLayout";
import AdminRootLayout from "./main layout/AdminLayout";
import {adminLoader,loader,userLoader, userOtherPage} from "./utils/loader";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { client } from "./utils/request";
import { lazy, Suspense } from "react";
import "./App.css";

const Register = lazy(()=>import('./account/Register/Register'));
const Login = lazy(()=>import('./account/Login/Login'));
const Verification = lazy(()=>import('./account/Verification/Verification'));
const ForgotPassword = lazy(()=>import('./account/ResetPassword/ResetPassword'));
const Homepage = lazy(() => import("./main layout/Homepage"));
const EditProfile = lazy(() => import("./themes/User/EditProfile"));
const ViewOrders = lazy(() => import("./themes/User/ViewOrders"));
const ViewCart = lazy(() => import("./themes/User/ViewCart"));
const DetailPage = lazy(()=>import('./themes/User/ItemDetails'));
const Adminpage = lazy(() => import("./main layout/AdminPage"));
const AdminEditProfile = lazy(() => import("./themes/Admin/EditProfile"));
const AddUser = lazy(()=>import('./themes/Admin/AddUser/AddUser'));
const Orders = lazy(() => import("./themes/Admin/Orders"));
const Users = lazy(() => import("./themes/Admin/Users"));
const UserDetails = lazy(()=>import('./themes/Admin/ViewUserDetails/ViewUserDetails'));
const EditUserInfo = lazy(()=>import('./themes/Admin/UpdateUserInfo/UpdateUserInfo'));
const EditFoodDetails = lazy(()=>import('./themes/Admin/UpdateFood'));
const ViewFoodDetails = lazy(()=>import('./themes/Admin/ViewItemDetails'));
const FoodForm =lazy(()=>import('./themes/Admin/AddFood/FoodForm'));

const router = createBrowserRouter([
  { 
    path: "/",
    element: <UserRootLayout />,
    loader:userLoader,
    children: [
      {
        index: true,
        element: (<Suspense fallback={<Loader />}>
            <Homepage/>
          </Suspense>),
      },{
        path:"foods/:id",
        element:(<Suspense fallback={<Loader/>}>
          <DetailPage/>
        </Suspense>)
      },
      {
        path: "cart",
        element: (<Suspense fallback={<Loader />}>
            <ViewCart />
          </Suspense>),
        loader:userOtherPage
      },
      {
        path: "edit-profile",
        element: (
          <Suspense fallback={<Loader />}>
            <EditProfile />
          </Suspense>
        ),
        loader:userOtherPage
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<Loader />}>
            <ViewOrders />
          </Suspense>
        ),
        loader:userOtherPage
      },
    ],
  },
  {
    path: "admin",
    element: <AdminRootLayout />,
    loader:adminLoader,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Adminpage />
          </Suspense>
        ),
      },
      {
        path:"foods/:id",
        element:(
          <Suspense fallback={<Loader/>}>
            <ViewFoodDetails/>
          </Suspense>
        )
      },
      {
        path:"users/:id",
        element:<Suspense fallback={<Loader/>}>
          <UserDetails/>
        </Suspense>
      },
      {
        path:"users/:id/edit",
        element:<Suspense fallback={<Loader/>}>
          <EditUserInfo/>
        </Suspense>
      },
      {
        path:"addfood",
        element:(
          <Suspense fallback={<Loader/>}>
          <FoodForm/>
          </Suspense>
        )
      },
      {
        path:"foods/:id/edit",
        element:(
          <Suspense fallback={<Loader/>}>
            <EditFoodDetails/>
          </Suspense>
        )
      },
      {
        path:"adduser",
        element:(
          <Suspense fallback={<Loader/>}>
            <AddUser/>
          </Suspense>
        )
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<Loader />}>
            <Users/>
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<Loader />}>
            <Orders />
          </Suspense>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <Suspense fallback={<Loader />}>
            <AdminEditProfile />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "register",
    element:<Suspense fallback={<Loader/>}>
    <Register/>
    </Suspense>
  },
  {
    path: "login",
    element: <Suspense fallback={<Loader/>}>
      <Login/>
    </Suspense>
  },
  {
    path: "verifyuser",
    element:<Suspense fallback={<Loader/>}>
      <Verification/>
    </Suspense>,
    loader: loader
  },
  {
    path: "forgotpassword",
    element: <Suspense fallback={<Loader/>}>
      <ForgotPassword/>
    </Suspense>
  },
  {
    path: "logout",
    action: action
  },
]);

function App() {
  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
