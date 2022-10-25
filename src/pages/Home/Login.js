import React, {useState,useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.scss";
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import Users from '../Admin/Users/Users'

import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,where, query, getDoc
} from "firebase/firestore";
import { db } from "../../services/firebase-config";
import { async } from "@firebase/util";
import { FunctionsOutlined } from "@mui/icons-material";

const Login = () => {
  const [isShown, setIsSHown] = useState(false);
  const [uname, setUName] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const colRef = collection(db,"Users");
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const [page, setPage] = useState();


    
  const [isSubmitted, setIsSubmitted] = useState(false);
 
  const handleSubmit = async (e)=>{
    e.preventDefault();
   
    
  if(!uname && !password){
    
    setUsernameError("Please fill out this field.");
    setPasswordError("Please fill out this field.");
   
  }else if (!uname && password !== ""){setUsernameError("Please fill out this field."); setPasswordError("");}
  else if(!password && uname !== ""){
    setUsernameError("");
    setPasswordError("Please fill out this field.");
  }
  else{
    
    setUsernameError("");
    setPasswordError("");

    let users =[];
    const q = query(colRef, where("username","==",uname));  
    getDocs(q).then(async (response) => {
        users = await response.docs.map((doc) => ({
        username: doc.data().username,
        password: doc.data().password,
        role: doc.data().role,
      }));     
    }).then(()=>{
      
      if (users.length === 0){
        setUsernameError("User does not exist!");
        setPasswordError("")
      }else{
        if(uname === users[0].username){
          bcrypt.compare(password,users[0].password, function(err,res){
            if(err){
              throw err;
            }else if(!res){
              setPasswordError("Incorrect Password!")
            }else{
              setPasswordError("Password Match")
              window.sessionStorage.setItem("username", users[0].username);
              window.sessionStorage.setItem("role", users[0].role);
              if (users[0].role === "Staff"){
                setPage("/animals");
              }else{
                setPage("/users");
              }
            }
            
          });
          
        }

      }
    
    });
   
  }


  
  }




  const togglePassword = () => {
    setIsSHown((isShown) => !isShown);
  };

  return (
    <div className="Auth-form-container">

    {
      username && role?
      <Navigate to={page}/>:

      <form className="Auth-form">
      <div className="Auth-form-content">
        <div class="center">
          <img src="/images/logo.png" className="loginLogo" />
        </div>
        <div className="form-floating mt-3">
          <input
            type="text"
            className={`form-control mt-1 ${ usernameError ? 'is-invalid':  ''}`}
            placeholder="Enter username"
            onChange={(e)=> {setUName(e.target.value);setUsernameError("");}} 
            id="floatingUsername"
            required />
            <label for="floatingUsername">Username</label>
            <div className="usernameError">{usernameError}</div>
        </div>
        <div className="form-floating mt-3">
          <input
             type={isShown ? "text" : "password"}
            className={`form-control mt-1 ${(usernameError || passwordError) ? 'is-invalid':  ''}`}
            placeholder="Enter password"
            onChange={(e)=> {setPassword(e.target.value); setPasswordError("");}}
            id="floatingPassword"
            required />
            <div className="passwordError">{passwordError}</div>
             <div class="right">
            <label htmlFor="checkbox">Show Password?&nbsp;</label>
            <input id="checkbox" type="checkbox" checked={isShown}  onChange={togglePassword}/>
            </div>
            <label for="floatingPassword">Password</label>
          
        </div>
        <div className="d-grid">
          <p className="forgot-password text-right">
            <Link to="/forgotpassword">
            <a href="#">Forgot password?</a>
            </Link>
          </p>
        </div>
        <div className="login-btn">
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </div>
    </form>

    }
    
     
       
      </div>
  );
};


export default Login;
