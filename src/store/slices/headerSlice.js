import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
    name:"header",
    initialState:null,
    reducers:{
        setHeaderData:(state,action)=>{
            return action.payload
        },
        clearHeaderData:(state)=>{
            return null;
        }
    }
})

export const {setHeaderData,clearHeaderData}=headerSlice.actions;
export default headerSlice.reducer;