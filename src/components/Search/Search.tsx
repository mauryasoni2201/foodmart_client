import { forwardRef } from "react";
import SearchProps from "../../models/SearchProps";
import "./Search.css";

const Search = forwardRef<HTMLInputElement, SearchProps>(({ onChange }, ref) => {
  return <div className="search-wrapper">
    <input className="search" placeholder="Search..." type="text" onChange={onChange} ref={ref} />
    </div>;
});

export default Search;
