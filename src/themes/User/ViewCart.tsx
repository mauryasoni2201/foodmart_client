import React from 'react';
import Section from '../../components/Section/Section';
import FoodListing from '../../components/FoodListing/FoodListing';
import FoodItem from '../../components/FoodItem/FoodItem';
import Button from '../../components/Button/Button';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { foodCartActions } from '../../store/foodCartSlice';
import {FoodCart} from '../../models/FoodCart';
import { useMutation } from '@tanstack/react-query';
import { backendUrl, client, sendRequest } from '../../utils/request';
import { useNavigate } from 'react-router-dom';
import "../Common.css";

const ViewCart:React.FC = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state:any)=>state.foodcart.items);
  const dispatch = useDispatch();
  const {isPending,mutate} = useMutation({
    mutationFn:sendRequest,
    onSuccess(response){
      if(response.statusCode===201){
        Swal.fire({
          icon: "success",
          title: `${response.data.message}`
        });
        dispatch(foodCartActions.changeCart([]));
        client.invalidateQueries({queryKey:['userorders']})
        navigate('/orders');
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
        });
      }else{
      Swal.fire({
        icon: "error",
        title: "Error Occured.",
        text: `${error.message}`,
      });
      dispatch(foodCartActions.changeCart(cartItems));
    }
    }
  })
  const handleRemoveItem=(_id:string):void=>{
    dispatch(foodCartActions.removeItem(_id));
  }
  const handleDecreaseQuantity=(_id:string):void=>{
    dispatch(foodCartActions.decreaseQuantity(_id));
  }
  const handleIncreaseQuantity=(_id:string):void=>{
    dispatch(foodCartActions.increaseQuantity(_id));
  }
  const handlePlaceOrder=():void=>{
    mutate({
      url:`${backendUrl}/api/orders`,
      configuration:{
        method:"POST",
        body:JSON.stringify(cartItems),
        headers:{
          'Content-type':"application/json",
          'Authorization':`Bearer ${Cookies.get('token')}`
        }
      }
    })
  }
  return (
    <Section heading='View Cart'>  
    {cartItems.length===0?null:<h2 className='totalprice'>Total : ₹{cartItems.reduce((prev:number,next:FoodCart)=>prev+next.totalPrice,0)}</h2>}
    <FoodListing>
    {cartItems.length === 0 ? (
            <div className="nocontent-text">
              <p>No food items added in cart.</p>
            </div>
          ) : (
            cartItems.map((element:FoodCart) => (
              <FoodItem key={element._id}>
                <div className="main-food-content">
                  <div className="food-image">
                    <img
                      width={"100%"}
                      height={"321px"}
                      loading="lazy"
                      src={`${backendUrl}/public/uploads/foods/${element.image}`}
                      alt={element.name}
                    />
                  </div>
                  <div className="food-details">
                    <div className="food-name">
                      <h1>{element.name}</h1>
                    </div>
                    <div className="food-price">
                      ₹{element.totalPrice}
                      </div>
                    <div className="food-description">
                      <p>Quantity:{element.quantity}</p>
                    </div>
                    <div className='food-options other-options'>
                    <div className='cart-button cart-decrease'>
                      <Button onClick={()=>handleDecreaseQuantity(element._id)}>-</Button>
                      </div>
                   <div className='cart-button'><Button onClick={()=>handleIncreaseQuantity(element._id)}>+</Button></div>
                   <div className='remove-button'>
                   <Button onClick={()=>handleRemoveItem(element._id)}>Remove</Button>
                   </div>
                  </div>
                  </div>
                </div>
                <div className="food-overlay">{element.category}</div>
              </FoodItem>
            ))
          )}
    </FoodListing>
    {!isPending&&<div className='remove-button'>
    {cartItems.length>=1&&<Button onClick={handlePlaceOrder}>Place order</Button>}
    </div>}
    {isPending&&<div className="nocontent-text">
    <p>Placing order....</p>
    </div>}
    </Section>);
}

export default ViewCart;
