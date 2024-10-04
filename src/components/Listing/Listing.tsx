import React from "react";
import FoodListing from "../FoodListing/FoodListing";
import Button from "../Button/Button";
import FoodDetails from "../../models/FoodDetails";
import FoodItem from "../FoodItem/FoodItem";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../utils/request";

const Listing: React.FC<{ data:object|any,admin?:boolean }> = ({ data,admin }) => {
  const foods:FoodDetails[] = data.foods;
  const navigate = useNavigate();
  return (
    <FoodListing center>
      {foods.length === 0 ? (
        <div className="nocontent-text">
          <p>No Food items Available.</p>
        </div>
      ) : (
        foods.map((element: FoodDetails) => (
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
                <div className="food-price">₹{element.price}</div>
                <Button
                  onClick={admin?()=>navigate(`/admin/foods/${element._id}`):() => navigate(`/foods/${element._id}`)}
                  style={{ width: "100%" }}
                >
                  View Details
                </Button>
              </div>
              <div className="food-overlay">{element.category}</div>
            </div>
          </FoodItem>
        ))
      )}
    </FoodListing>
  );
};

export default Listing;
