import UsersListing from "./UserListing";
import UserReview from "./UserReview";

export default interface FoodDetails{
    _id:string;
    name:string;
    description?:string|any;
    price:number;
    image:string;
    category:string;
    averageRating?:number|any ;
}

export interface FoodDetailsAndReviews extends FoodDetails{
    user:UsersListing;
    rating:UserReview[]|any;
}