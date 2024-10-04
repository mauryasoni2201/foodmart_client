import UserReview from "./UserReview";
import UserInformation from "./UserDetails";
import { FoodCart } from "./FoodCart";

export default interface UserOrders{
   _id:string;
   items:FoodCart[];
   user:UserInformation;
   rating:{}|UserReview;
}
