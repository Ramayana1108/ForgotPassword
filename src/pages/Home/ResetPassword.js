import React, {useState,useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ResetPass.scss";
import { collection, query, where,getDocs, doc, getDoc,updateDoc, QuerySnapshot, deleteField } from "firebase/firestore";
import { db } from "../../services/firebase-config";
import validator from 'validator';
import bcrypt, { compare } from 'bcryptjs';
import { Temporal } from '@js-temporal/polyfill';
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ImFileText } from "react-icons/im";
import { FirebaseError } from "firebase/app";


const ResetPassword = () => {
  const [pass, setPass]= useState("")
  const [repass, setRepass]= useState("")
  const [passError, setPassError]= useState("")
  const [repassError, setRepassError]= useState("")
  const [resetDate, setResetDate]=useState("")
  const [today,setToday]=useState("")
  const [validLink, setValidLink]= useState(true);
  var date2 = new Date();
  const pathname = window.location.pathname;
  const id = pathname.substring(15);
  const docRef = doc(db,'Users',id);
  const navigate = useNavigate();

  useEffect(() => {
    getDoc(docRef).then((results)=>{

       if(date2.getTime()<=results.data().reset_request_date_time){        
        setValidLink(true)
      }else{ 
        setValidLink(false)
      }
    })
    
  }, []);


  const handleSubmit = async (e)=>{
    e.preventDefault();
    console.log(validLink)
    
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
                reset_request_date_time: deleteField(),
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
    <div>
      { validLink === true?
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
    
    :

    <div className="Auth-form-container">
      <form className="Auth-form">
      <div className="Auth-form-content">
        <div class="center">
          <img src="/images/logo.png" className="loginLogo" />
        </div>
        <div className="form-floating mt-3">
          <h3>Link has expired</h3>
        </div>
      </div>
    </form>
    </div>
    }
    </div>
  );
}

export default ResetPassword;