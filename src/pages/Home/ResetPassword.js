import React, {useState,useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ResetPass.scss";
import { collection, query, where,getDocs, doc, getDoc,updateDoc, QuerySnapshot } from "firebase/firestore";
import { db } from "../../services/firebase-config";
import validator from 'validator';
import bcrypt from 'bcryptjs';

import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [pass, setPass]= useState("")
  const [repass, setRepass]= useState("")
  const [passError, setPassError]= useState("")
  const [repassError, setRepassError]= useState("")
  const pathname = window.location.pathname
  const id = pathname.substring(15);
  const docRef = doc(db,'Users',id);
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    
    console.log(pass);
    console.log(repass);
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
              updateDoc(docRef,{
              
                password: String(bcrypt.hashSync(pass,10))
              } ).then(response => {
                  alert("Password Reset Successful")
                  navigate("/");
                }).catch(error =>{
                  console.log(error.message)
                })
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