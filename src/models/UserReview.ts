export default interface UserReview{
    _id?:string;
    time?:Date;
    review:string;
    rating:number;
}

export interface FoodItemUserReviews{
    reviews:UserReview[];
}