import React, {useState,useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ResetPass.scss";

import validator from 'validator';
import bcrypt from 'bcryptjs';

import { Navigate } from "react-router";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [pass, setPass]= useState("")
  const [repass, setRepass]= useState("")
  const [passError, setPassError]= useState("")
  const [repassError, setRepassError]= useState("")


  const handleSubmit = async (e)=>{
    e.preventDefault();
  
    if(!pass){
      setPassError("No input");
    }else{
      setPassError("");
      if(pass !==""){
        if (validator.isStrongPassword(pass, {
          minLength: 8, minLowercase: 1,
          minUppercase: 1, minNumbers: 1, minSymbols: 1
        })){
            
            if(pass=== repass){
              setPassError("");
              setRepassError("");
              console.log("successfully updated")

            }else{
              setRepassError("Passwords do not match");
            }


        }else{
          setPassError('* Password must have at least 8 characters, 1 lowercase, 1 upprecase, 1 number and a symbol')
        }
      }
    }
  
  }




  return (
    <div className="Auth-form-container">
   <form className="Auth-form">
      <div className="Auth-form-content">
        <div class="center">
          <img src="/images/logo.png" className="loginLogo" />
        </div>
        <div className="form-floating mt-3">
          <input
            type="password"
            className={`form-control mt-1 ${ passError ? 'is-invalid':  ''}`}
            placeholder="Enter new password"
            onChange={(e)=> {setPass(e.target.value);setPassError("");}} 
            id="floatingUsername"
            required />
            <label for="floatingUsername">New Password</label>
            <div className="usernameError">{passError}</div>
        </div>
        <div className="form-floating mt-3">
          <input
            type="password"
            className={`form-control mt-1 ${ repassError ? 'is-invalid':  ''}`}
            placeholder="Retype password"
            onChange={(e)=> {setRepass(e.target.value);setRepassError("");}} 
            id="floatingPassword"
            required />
            <div className="passwordError">{repassError}</div>
            <label for="floatingPassword">Retype password</label>
          <br></br>
        </div>
  
        <div className="login-btn">
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </form>
    </div>
  );
}

export default ResetPassword;