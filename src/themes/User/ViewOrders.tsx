import Section from '../../components/Section/Section';
import Cookies from 'js-cookie';
import Error from '../../components/Error/Error';
import Loader from '../../components/Loader/Loader';
import FoodListing from '../../components/FoodListing/FoodListing';
import FoodItem from '../../components/FoodItem/FoodItem';
import Review from '../../components/Review/Review';
import UserOrders from '../../models/Orders';
import {useQuery} from '@tanstack/react-query';
import {backendUrl, getAllData} from '../../utils/request';
import {FoodCart} from '../../models/FoodCart';
import { Box, Rating } from '@mui/material';
import "../Common.css";

const ViewOrders:React.FC = () => {
  const {data,isError,error,isLoading} = useQuery({
    queryKey:['userorders'],
    queryFn:()=>getAllData(`${backendUrl}/api/user-details`,{
      headers:{
        'Authorization':`Bearer ${Cookies.get('token')}`
      }
    })
  });
  let content;
  if(isError){
     content = <Error message={error.message}/>;
  }
  if(isLoading){
    content = <Loader/>;
  }
  if(data){
    content = <FoodListing>
    {data.orders.length===0? (
    <div className="nocontent-text"><p>No orders placed.</p></div>):data.orders.map((element:UserOrders,index:number)=>{
      return <FoodItem rating key={element._id}>
      {element.items.map((item: FoodCart) => (
        <div key={item._id} className='order-wrapper'>
          <div className='order-content'>
            <div className='order-image'>
              <img
                width={"80px"}
                height={"80px"}
                loading="lazy"
                src={`${backendUrl}/public/uploads/foods/${item.image}`}
                alt={item.name}
                />  
            </div>
            <div className='order-details'>
            <div className='order-name'><h2>{item.name}</h2></div>  
            <div className='order-category'><h3>{item.category.charAt(0).toUpperCase()+item.category.slice(1)}</h3></div>
            </div>
          </div>
          <div className='order-info'>
            <div className='order-price'><h4>₹{item.totalPrice}</h4></div>
            <div className='order-quantity'><h5>Qty:{item.quantity}</h5></div>
          </div>
        </div>
      ))} 
      <div className='order-total'>
        <h6>
        Total:₹{element.items.reduce((prev:number,next:object|any)=>prev+next.totalPrice,0)}
        </h6>
      </div>
        <div className='give-review'>
        {Object.entries(data.orders[index].rating).length<=1? (
        <Review order={data.orders[index]._id.toString()} />
) : (
  <>
  <span className='review-text'>Your Rating:</span>
  <Box sx={{ '& > legend': { mt: 2 } }}>
    <Rating
      name="rating"
      value={data.orders[index].rating.rating}
      precision={0.5}
      readOnly
    />
  </Box>
  </>
)}
</div>
    </FoodItem>})}
  </FoodListing>;
  }
  return (
     <Section heading='View Orders'>  
        {content}
    </Section>
  )
}

export default ViewOrders;
