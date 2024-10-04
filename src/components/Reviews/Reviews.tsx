import React from "react";
import Review from "./Review";
import { FoodDetailsAndReviews } from "../../models/FoodDetails";
import "./Reviews.css";

const Reviews: React.FC<{reviews:FoodDetailsAndReviews[]}> = ({ reviews }) => {
  return (
    <>
      <section className="reviews">
        <div className="container">
        <div className="reviews-content">
          <div className="reviews-title">
            <h2>Reviews</h2>
          </div>
          <div className="review-card-main">
            {reviews.map((element:FoodDetailsAndReviews,index:number) => (
                <Review key={index} review={element} />
            )
            )}
          </div>
        </div>
        </div>
      </section>
    </>
  );
};

export default Reviews;
