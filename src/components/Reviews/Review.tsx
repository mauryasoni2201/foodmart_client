import React from "react";
import { Box, Rating } from "@mui/material";
import "./Reviews.css";

const Review: React.FC<{ review: object | any }> = ({ review }) => { 
  const date = new Date(review.rating.time);
  const options: object = {
    year: "numeric",
    month: "long",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return (
    Object.keys(review.rating).length===1?null:<div key={review.rating._id} className="review-card-wrapper">
      <div className="review-card">
        <div className="reviewer-name">
          <h3>{review.user.name}</h3>
        </div>
        <div className="reviewer-email">
          <h4>{review.user.email}</h4>
        </div>
        <div className="reviewer-comment">
          <p>{review.rating.review}</p>
        </div>
        <Box sx={{ "& > legend": { mt: 2 } }}>
          <Rating
            name="rating"
            value={review.rating.rating}
            precision={0.5}
            readOnly
          />
        </Box>
        <div className="review-date">
          <p>{formattedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Review;
