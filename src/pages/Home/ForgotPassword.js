import React, {useState,useRef} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.scss";
import "./ForgotPassword.scss";
import emailjs from 'emailjs-com';
import { Navigate } from "react-router";
import {useNavigate, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,where, query, updateDoc
} from "firebase/firestore";
import { db } from "../../services/firebase-config";


const ForgotPassword = () => {
    const [user_email,setUser_Email] = useState();
    const [emailError,setEmailError] = useState("");
    const colRef = collection(db,"Users");
  

   const navigate = useNavigate();

   function makeid() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

   const handleSubmit = async (e)=>{
    e.preventDefault();
      if(!user_email){
        setEmailError("*Please fill out this field.");
      }else{
        const q = query(colRef, where("email","==",user_email));  
        let useremail= [];
        getDocs(q).then(async (response) => {
          useremail = await response.docs.map((doc) => ({
          email: doc.data().email,
          name: doc.data().first_name,
          id: doc.id      
        }));     
      }).then(()=>{
        if(useremail[0].email === 0){
          setEmailError("*Email does not exist or is not an administrator");
        }else{
          var templateParams = {
            user_email: useremail[0].email,
            name: useremail[0].name,
            link:  "http://localhost:3000/resetpassword/"+ useremail[0].id + makeid()
        };
          emailjs.send('service_rbj9nsp', 'template_7eppjnx', templateParams, 'toC84K2tm5N48z4A-')
          .then((result) => {
            const docRef = doc(db,'Users',  useremail[0].id );
            const now = new Date().getTime()+ 30*60000;
            
            updateDoc(docRef,{
              reset_request_date_time:now,
            } ).then(()=>{
              alert("Email Sent");
              navigate("/");
            })

          
          }, (error) => {
              console.log(error.text);
          });
        }
      })
      }
   }

    const Cancel = () =>{
       navigate("/");
    }
 


  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
      <div className="Auth-form-content">
        <div class="center">
          <img src="/images/logo.png" className="loginLogo" />
        </div>
        <div className="form-group mt-3">
          <label>Email</label>
          <input
            type="text"
            name="user_email"
            className="form-control mt-1"
            placeholder="Enter Email"     
            onChange={(e)=> {setUser_Email(e.target.value); setEmailError("");}}     
          />
           <div className="error-text">{emailError}</div>
        </div>
     <br></br>
        <div className="forgotpassword-btn-add">
          <button type="submit" className="btn btn-primary-add" onClick={handleSubmit}>
            Submit
          </button>
          <button type="submit" className="btn btn-primary-cancel" onClick={Cancel}>           
            Cancel         
          </button>
        </div>
      </div>
    </form>

      </div>
  );
};


export default ForgotPassword;
