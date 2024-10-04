import FoodDetails from "./FoodDetails";

export interface FoodCart extends FoodDetails {
   totalPrice:number;
   quantity:number;
   food:string;
}

export default interface FoodCartItems{
   items:FoodCart[];
}