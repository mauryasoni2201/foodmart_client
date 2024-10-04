import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import FoodCartItems from "../models/FoodCart";

const initialState:FoodCartItems = {
  items:JSON.parse(localStorage.getItem("foodcart")??"[]")
}

const foodCartSlice = createSlice({
  name:"foodcart",
  initialState,
  reducers:{
    addItem(state,action){
      if(!Cookies.get('token')&&!Cookies.get('role')){
        Swal.fire({
          title: `Please do Login/Signup to add items in your cart.`,
          icon: "error",
        });
      }else{
      const item = action.payload;
      const findItem = state.items.findIndex(({_id})=>_id===item._id);
      if(findItem===-1){
        state.items.push(item);
        localStorage.setItem("foodcart",JSON.stringify(state.items));
        Swal.fire({
          title: `Item added to cart.`,
          icon: "success",
        });
      }else{
        state.items[findItem].quantity++;
        state.items[findItem].totalPrice = state.items[findItem].totalPrice + state.items[findItem].price;
        localStorage.setItem("foodcart",JSON.stringify(state.items));
        Swal.fire({
          title: `Item's quantity updated.`,
          icon: "success",
        });
      }
    }
    },
    removeItem(state,action){
      state.items = state.items.filter(({_id})=>_id!==action.payload);
      localStorage.setItem("foodcart",JSON.stringify(state.items));
      Swal.fire({
        title: `Item removed successfully.`,
        icon: "success",
      });
    }
    ,decreaseQuantity(state,action){
      const findItem = state.items.findIndex((element)=>element._id===action.payload);
      if(state.items[findItem].quantity<=1){
        state.items = state.items.filter(({_id})=>_id!==action.payload);
        localStorage.setItem("foodcart",JSON.stringify(state.items));
        Swal.fire({
          title: `Item removed successfully.`,
          icon: "success",
        });
      }else{
        state.items[findItem].quantity--;
        state.items[findItem].totalPrice = state.items[findItem].totalPrice - state.items[findItem].price;
        localStorage.setItem("foodcart",JSON.stringify(state.items));
      }
    },
    increaseQuantity(state,action){
      const findItem = state.items.findIndex((element)=>element._id===action.payload);
      state.items[findItem].quantity++;
      state.items[findItem].totalPrice = state.items[findItem].totalPrice + state.items[findItem].price;
      localStorage.setItem("foodcart",JSON.stringify(state.items));
    },
    changeCart(state,action){
      state.items = action.payload;
      localStorage.setItem("foodcart",JSON.stringify(action.payload));
    }
  }
});

export default foodCartSlice;
export const foodCartActions = foodCartSlice.actions;
