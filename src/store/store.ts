import {configureStore} from "@reduxjs/toolkit";
import foodCartSlice from "./foodCartSlice";

const store = configureStore({
    reducer:{
        foodcart:foodCartSlice.reducer
    }
});

export default store;