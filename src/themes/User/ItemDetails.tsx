import React from 'react';
import Section from '../../components/Section/Section';
import Error from '../../components/Error/Error';
import Loader from '../../components/Loader/Loader';
import ProductDetail from '../../components/DetailCard/DetailCard';
import Reviews from '../../components/Reviews/Reviews';
import Listing from '../../components/Listing/Listing';
import FoodDetails, { FoodDetailsAndReviews } from "../../models/FoodDetails";
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { backendUrl, getAllData } from '../../utils/request';
import "./User.css";
import "../Common.css";

const ItemDetails:React.FC = () => {
  const {id} = useParams();
  const {isLoading,isError,data,error} = useQuery({
    queryKey:['foods',id],
    queryFn:()=>getAllData(`${backendUrl}/api/foods/${id}`)
  });
  const {isLoading:isRelatedLoading,isError:isRelatedError,data:relatedData,error:relatedError} = useQuery({
    queryKey:['related-products',data&&data.category],
    queryFn:()=>getAllData(`${backendUrl}/api/foods?category=${data&&data.category}`),
    enabled:(typeof data?.category==="string")
  });
  let content;
  let relatedContent;
  let reviewsRating;
  if(isError){
    content = <Error message={error.message}/>;
  }
  if(isLoading){
    content = <Loader/>;
  }
  if(data){ 
    const foodData:FoodDetailsAndReviews = data;
    content = <>
    <ProductDetail item={foodData}/>
    </>
    const productReviews:object[]|any = data.reviews.filter((element:object|any)=>{
      return Object.entries(element.rating).length!==1;
    });
    reviewsRating = productReviews.length===0?<div style={{paddingTop:"30px"}} className='nocontent-text'>
      <p>No Reviews Available.</p>
    </div>:<Reviews reviews={productReviews}/>
  }
  if(relatedData){
    const filteredData:object|any = relatedData.foods.filter((element:FoodDetails)=>element._id!==id);
    relatedContent = <Listing data={{foods:filteredData}}/>
  }
  if(isRelatedError){
    relatedContent = <Error message={relatedError.message}/>;
  }
  if(isRelatedLoading){
    relatedContent = <Loader/>;
  }
  return (<>
    <div className='food-details-wrapper'>
    <Section heading='Food-details'>
       {content}
    </Section>
    </div>
    {reviewsRating}
    <div className='related-products-wrapper'>
    <Section heading=''>
      <h2>You Might Also Like</h2>
      {relatedContent}
    </Section>
    </div>
    </>)
}

export default ItemDetails;
