  import React from "react";
  import Button from "../Button/Button";
  import Box from "@mui/material/Box";
  import Rating from "@mui/material/Rating";
  import Slider from "react-slick";
  import { foodCartActions } from "../../store/foodCartSlice";
  import { NavigateFunction, useNavigate } from "react-router-dom";
  import { useDispatch } from "react-redux";
  import { backendUrl } from "../../utils/request";
  import FoodDetails from "../../models/FoodDetails";
  import "slick-carousel/slick/slick.css";
  import "slick-carousel/slick/slick-theme.css";
  import "./DetailCard.css";

  const ProductDetail: React.FC<{ item: FoodDetails }> = ({ item }) => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed:1500
    };
    const dispatch = useDispatch();
    const handleAddToCart = (): void => {
      dispatch(
        foodCartActions.addItem({
          _id: item._id,
          name: item.name,
          price: item.price,
          totalPrice: item.price,
          quantity: 1,
          image: item.image,
          category: item.category,
        })
      );
    };
    const navigate: NavigateFunction = useNavigate();
    const handleClick = (): void => navigate("/");
    return (
      <div className="details">
        <div className="details-wrapper">
          <div className="detail-card-wrapper">
            <div className="detail-card">
              <div className="detail-image">
              <Slider {...settings}>
              <a
                  target="_self"
                  href={`${backendUrl}/public/uploads/foods/${item.image}`}
                >
                  <img
                    src={`${backendUrl}/public/uploads/foods/${item.image}`}
                    height={"400px"}
                    width={"100%"}
                    alt={item.name}
                    loading="lazy"
                  />
                </a>
                <a
                  target="_self"
                  href={`${backendUrl}/public/uploads/foods/${item.image}`}
                >
                  <img
                    src={`${backendUrl}/public/uploads/foods/${item.image}`}
                    height={"400px"}
                    width={"100%"}
                    alt={item.name}
                    loading="lazy"
                  />
                </a>
                <a
                  target="_self"
                  href={`${backendUrl}/public/uploads/foods/${item.image}`}
                >
                  <img
                    src={`${backendUrl}/public/uploads/foods/${item.image}`}
                    height={"400px"}
                    width={"100%"}
                    alt={item.name}
                    loading="lazy"
                  />
                </a>
                </Slider>
              </div>
              <div className="product-information">
                <div className="product-name">
                  <h2>{item.name}</h2>
                </div>
                <div className="product-price">
                  <h3>₹{item.price}</h3>
                </div>
                <Box sx={{ '& > legend': { mt: 2 } }}>  
                   <Rating key={item.averageRating} name="half-rating-read" defaultValue={item.averageRating} precision={0.5} readOnly />
                </Box>
                <div className="product-description">
                  <p>{item.description}</p>
                </div>
                <div className="options">
                  <Button onClick={handleAddToCart}>Add To Cart</Button>
                  <Button onClick={handleClick}>Back</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ProductDetail;
