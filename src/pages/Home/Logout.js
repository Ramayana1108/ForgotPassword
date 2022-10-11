import React from "react";
import { Navigate } from "react-router";

const Logout = () => {

    sessionStorage.clear();
    
  return (
    <div>
      <Navigate to="/"/>
    </div>
  );
}

export default Logout;