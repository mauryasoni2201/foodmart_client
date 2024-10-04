import React from "react";
import Section from "../../components/Section/Section";
import Cookies from "js-cookie";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import FoodListing from "../../components/FoodListing/FoodListing";
import FoodItem from "../../components/FoodItem/FoodItem";
import UserOrders from "../../models/Orders";
import { FoodCart } from "../../models/FoodCart";
import { Box, Rating } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { backendUrl, getAllData } from "../../utils/request";
import "./Admin.css";
import "../Common.css";

const Orders: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      getAllData(`${backendUrl}/api/orders`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
  });
  let content;
  if (isLoading) {
    content = <Loader />;
  }
  if (isError) {
    content = <Error message={error.message} />;
  }
  if (data) {
    const userOrders: UserOrders[] = data;
    content = (
      <FoodListing>
        {userOrders.length === 0 ? (
          <div className="nocontent-text">
            <p>No orders placed.</p>
          </div>
        ) : (
          userOrders.map((element: UserOrders, index: number) => {
            return (
              <FoodItem rating key={element._id}>
                {element.items.map((item: FoodCart) => (
                  <div key={item._id} className="order-wrapper">
                    <div className="order-content">
                      <div className="order-image">
                        <img
                          width={"80px"}
                          height={"80px"}
                          loading="lazy"
                          src={`${backendUrl}/public/uploads/foods/${item.image}`}
                          alt={item.name}
                        />
                      </div>
                      <div className="order-details">
                        <div className="order-name">
                          <h2>{item.name}</h2>
                        </div>
                        <div className="order-category">
                          <h3>
                            {item.category.charAt(0).toUpperCase() +
                              item.category.slice(1)}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="order-info">
                      <div className="order-price">
                        <h4>₹{item.totalPrice}</h4>
                      </div>
                      <div className="order-quantity">
                        <h5>Qty:{item.quantity}</h5>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="order-total">
                  <h6>
                    Total:₹
                    {element.items.reduce(
                      (prev: number, next: object | any) =>
                        prev + next.totalPrice,
                      0
                    )}
                  </h6>
                </div>
                <div className="give-review">
                  <div className="user-order-info">
                    <div className="order-total left-align">
                      <span className="review-text">User's Name:</span>
                      <h6>{element.user.name}</h6>
                      <span className="review-text">User's Email:</span>
                      <h6>{element.user.email}</h6>
                      <span className="review-text">User's Address:</span>
                      <p>{element.user.address}</p>
                    </div>
                    {Object.entries(element.rating).length === 1 ? (
                      <div className="nocontent-text align-end">
                        <p>Review not given yet.</p>
                      </div>
                    ) : (
                      <div className="user-review">
                        <span className="review-text">User's Rating:</span>
                        <Box sx={{ "& > legend": { mt: 2 } }}>
                          <Rating
                            name="rating"
                            value={data[index].rating.rating}
                            precision={0.5}
                            readOnly
                          />
                        </Box>
                        <span className="review-text">User's Review:</span>
                        <p>{data[index].rating.review}</p>
                      </div>
                    )}
                  </div>
                </div>
              </FoodItem>
            );
          })
        )}
      </FoodListing>
    );
  }
  return<Section heading="Orders">{content}</Section>;
};

export default Orders;
