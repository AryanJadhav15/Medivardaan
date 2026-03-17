"use client";
import { createSlice } from "@reduxjs/toolkit";

const parameterTypeSlice = createSlice({
    name:"parameterType",
    initialState:null,
    reducers:{
        setParameterType:(state,action)=>{
            return action.payload
        },
        clearParameterType:()=>{
          return null;
        }
    }
});


export const {setParameterType,clearParameterType} = parameterTypeSlice.actions;
export default parameterTypeSlice.reducer;
