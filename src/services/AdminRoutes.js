import React, {useState} from "react";
import { Navigate, Outlet } from "react-router";


const useAuth = () =>{

    const user = {Role: false};
    const role = sessionStorage.getItem("role");
    if (role ==="Staff"){
        user.Role = false;
        return user && user.Role;
       
    }else{
        user.Role = true;
        return user&& user.Role;
    }  
    
};

const AdminRoutes = ()=>{

    const isAuth = useAuth();

    return isAuth? <Outlet/> : <Navigate to= "/animals" /> ;
}

export default AdminRoutes;