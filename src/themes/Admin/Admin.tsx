import React, {useState,useRef,useCallback,useMemo} from "react";
import Section from "../../components/Section/Section";
import Error from "../../components/Error/Error";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import Search from "../../components/Search/Search";
import Select from "../../components/Select/Select";
import Listing from "../../components/Listing/Listing";
import debounce from "lodash.debounce";
import categories, { Category } from "../../utils/category";
import { Pagination, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { backendUrl,getAllData } from "../../utils/request";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import "../Common.css";

const Admin: React.FC = () => {
  const [options,setOptions] = useState<{search:string,category:string,page:number}>({search:"",category:"",page:1});
  console.log(options.search);
  const searchTerm = useRef<HTMLInputElement|any>(null);
  const handleChange=(value:string|number,key:string)=>{
    setOptions((prev)=>{
      return {
        ...prev,
        [key]:value
      }
    });
  }
  const dispatchDebounced = useMemo(()=>debounce((value: string)=>{
    setOptions((prev)=>{
       const updated = {...prev};
       updated.search = value;
       return updated;
    });
  },1000),[]);
  const handleSearch = useCallback(() => {
    dispatchDebounced(searchTerm.current.value.toLowerCase());
  }, [dispatchDebounced]);
  const navigate = useNavigate();
  const handleAddFood = (): void => {
    navigate("/admin/addfood");
  };
  const {data, isLoading, isError, error} = useQuery({
    queryKey: ["foods",options.page],
    queryFn: ({queryKey}) => getAllData(`${backendUrl}/api/foods?page=${queryKey[1]}&limit=${10}`)
  });
  const {data:categoryData,isLoading:isLoadingCategory,isError:isErrorCategory,error:categoryError}= useQuery({
    queryKey:["foods",options.category],
    queryFn:({queryKey})=>getAllData(`${backendUrl}/api/foods?category=${queryKey[1]}`),
    enabled:options.category!==""
  });
  const {data:searchData,isLoading:isLoadingSearch,isError:isSearchError,error:searchError} = useQuery({
    queryKey:["foods",options.search],
    queryFn:({queryKey})=>getAllData(`${backendUrl}/api/foods?search=${queryKey[1]}`),
    enabled:options.search!==""
  });
  let content;
  if (isLoading||isLoadingSearch||isLoadingCategory) {
    content = <Loader />;
  }
  if (isError||isErrorCategory||isSearchError) {
    content = <Error message={error?.message||categoryError?.message||searchError?.message} />;
  }
  let count;
  if (data) {
    count = Math.ceil(data.count / 10);
    content = <Listing admin data={data}/>
  }
  if(searchData){
    content =  <Listing admin data={searchData}/>
  }
  if(categoryData){
    content = <Listing admin data={categoryData}/>
  }
  return (
    <>
      <div className="container">
      <div className="add-food-item-button no-padding">
        <Button onClick={handleAddFood}>Add Food</Button>
      </div>
          <div className="app-options">
          <div className="category-selection">
            <Select onChange={(e:object|any)=>handleChange(e.target.value,"category")} name='category'>
              <option value={''}>Category</option>
              {categories.map((element:Category)=>(
               <option key={element.value} value={element.value}>
                {element.value.charAt(0).toUpperCase()+element.value.slice(1)}
                </option>
              ))}
            </Select>
            </div>
            <Search ref={searchTerm} onChange={handleSearch} />
          </div>
        </div>
      <Section heading="Our Food Items">
      {content}
      </Section>
      {categoryData||searchData?null:<div className="align-pagination">
      <Stack spacing={2}>
      <Pagination onChange={(e, value) => handleChange(value, "page")} count={count} />
      </Stack>
      </div>}
      </>
  );
};

export default Admin;
