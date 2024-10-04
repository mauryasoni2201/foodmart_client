import React,{useState} from "react";
import Button from "../Button/Button";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import * as yup from "yup";
import UserReview from "../../models/UserReview"
import { useMutation } from "@tanstack/react-query";
import { backendUrl, client, sendRequest } from "../../utils/request";
import { Box, Rating } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";;

const Review: React.FC<{order:string}>= ({order}) => {
  const navigate = useNavigate();
  const validation = yup.object().shape({
    review: yup.string().required("Review is required").min(2, "Review must be at least 2 characters"),
    rating: yup.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5").required("Rating is required")
  });
  const {register,handleSubmit,reset,setValue,formState:{errors}} = useForm({resolver:yupResolver(validation)});
  const [review, setReview] = useState<boolean>(false);
  const handleToogle=():void=>{
    reset();
    setReview((prev)=>!prev);
  };
  const {mutate,isPending} = useMutation({mutationFn:sendRequest,
    onSuccess(response){
       if(response.statusCode===200){
        Swal.fire({
          title: `User Review Successfully.`,
          icon: "success",
          willClose(){
            client.invalidateQueries({queryKey:['userorders']});
            client.invalidateQueries({queryKey:['foods']});
            handleToogle();
          }
        });
       }
    },onError(error:any){
      if(error.message==="Unauthorized user"||error.message==="Token is required."||error.message==="jwt malformed"){
        Swal.fire({
          icon: "error",
          title: "Error Occured!",
          text: `Not allowed`,
          willClose(){
            Cookies.remove('token');
            navigate('/login');
          }
        })
      }else{
          Swal.fire({
            icon: "error",
            title: "Error Occured.",
            text: `${error.message}`,
          });
        }
  }});
  const handleReview=(data:UserReview):void=>{
    mutate({
      url:`${backendUrl}/api/orders/${order}/review`,
      configuration: {
        method:"PUT",
        headers: {
          'Content-type':"application/json",
          'Authorization':`Bearer ${Cookies.get('token')}`
        },
        body:JSON.stringify(data)
      }
    });    
  }
  return (
    <>
      {!review && <Button onClick={handleToogle}>Please rate us</Button>}
      {review && (
        <div className="review-form">
          <form onSubmit={handleSubmit(handleReview)}>
            <textarea rows={3} placeholder="Enter your review here" {...register("review")} />
            {errors.review?.message&&<p className="nocontent-text">{errors.review.message}</p>}
                <Box sx={{ '& > legend': { mt: 2 } }}>  
                <Rating
                 name="rating"
                 onChange={(_, value: number | any) => {
                 setValue("rating", value);
                 }} precision={0.5}/>
                </Box>
                {errors.rating?.message&&<p  className="nocontent-text">{errors.rating.message}</p>}
            <div className="review-options">
             {!isPending&&<>
              <Button type="submit">Submit</Button>
              <Button onClick={handleToogle}>Cancel</Button>
             </>}
             {isPending&&<div className="nocontent-text">
              <p>Submiting your review....</p>
              </div>}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Review;
