import React, {useState} from "react";
import { Navigate, Outlet } from "react-router";


const useAuth = () =>{

    const user = {loggedIn: false};
    const username = sessionStorage.getItem("username");
    if (!username){
        user.loggedIn = false;
        return user&& user.loggedIn;
       
    }else{
        user.loggedIn = true;
        return user&& user.loggedIn;
    }  
    
};

const ProtectedRoutes = ()=>{

    const isAuth = useAuth();

    return isAuth? <Outlet/> : <Navigate to= "/" /> ;
}

export default ProtectedRoutes;