"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    token:null,
    user:null,
    userData:null,
    
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.token=action.payload.token;
            state.user=action.payload.user;
            state.userData=action.payload;

            try {
                localStorage.setItem("token",action.payload.token);
                localStorage.setItem("userID",action.payload.user);
                localStorage.setItem("user",JSON.stringify(action.payload));
            } catch (error) {
                // Handle localStorage quota exceeded or other errors
                console.error("Failed to save to localStorage:", error);
            }
        },
        Logout:(state)=>{
            state.token=null;
            state.user=null;
            state.userData=null;
            localStorage.removeItem("token");
            localStorage.removeItem("userID");
            localStorage.removeItem("user");
        }
    }
});

export const {setCredentials,Logout}=authSlice.actions;
export default authSlice.reducer;