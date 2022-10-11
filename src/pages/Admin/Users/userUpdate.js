import { db } from "../../../services/firebase-config";  
import React,{useState, useEffect} from "react";
import { Link, useLocation, useNavigate,location,state } from 'react-router-dom'
import { collection, query, where,getDocs, doc, getDoc,updateDoc, QuerySnapshot } from "firebase/firestore";
import NavWrapper from "../../../components/navbar/NavWrapper";

import validator from 'validator'
import bcrypt from 'bcryptjs';
import "./userUpdate.scss";


const UserUpdate = () => {
    //Redirecting
    const navigate = useNavigate();

    //getting user
    const getUser = useLocation();
    const uid = getUser.state.userid;
    
    //kuha data from firebase
    const [data, setData] = useState("");
    const [values, setValues] = useState("");
    const [password, setPassword]= useState("");
    const [passError, setPassError] = useState("");
    const [canEdit, setCanEdit] = useState("");
    
    const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false);

    const docRef = doc(db,'Users',uid);
    
    useEffect(() => {
        getDoc(docRef).then(doc => {
            const newData = doc.data();
            setData(newData);
            setValues(newData);
            setCanEdit(String(newData.canEdit));     
        });
        }, []);
        
    //handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
      };


     //show password toggle
     const [isShown, setIsSHown] = useState(false);
     const togglePassword = () => {
         setIsSHown((isShown) => !isShown);
       };

    const updateUser =(e)=>{
    e.preventDefault();

      if(password !==""){
        if (validator.isStrongPassword(password, {
          minLength: 8, minLowercase: 1,
          minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
          setPassError("");
          if(window.confirm("Do you want to save changes?")){
            updateDoc(docRef,{
              canEdit:values.canEdit,
              password: String(bcrypt.hashSync(password,10))
            } ).then(response => {
                alert("Successfully Updated")
                navigate("/users");
              }).catch(error =>{
                console.log(error.message)
              })
          }
          
        } else {
          setPassError('* Password must have at least 8 characters, 1 lowercase, 1 upprecase, 1 number and a symbol')
        }

      }else{
        setPassError("");
        if(window.confirm("Do you want to save changes?")){
          updateDoc(docRef,{
            canEdit:values.canEdit,
           } ).then(response => {
             alert("Successfully Updated")
             navigate("/users");
           }).catch(error =>{
             console.log(error.message)
           })
        }
        
      }

      
    }

   
    //cancel Button
    function Cancel(){
        navigate("/users")
    }
    
    return(
        <NavWrapper>
        <h1 class="registerTitle">Edit Admin Staff</h1> 
        <div className="Auth-form-container-add">
        <form className="Auth-form-add">
          <div className="Auth-form-content-add">
            <div class="center">
            </div>
            <div className="form-group mt-3">
              <label>First Name</label>
              <input
                type="string"
                name="first_name"
                className="form-control mt-1"
                placeholder="Enter First Name"
                value={values.first_name}
                onChange={handleInputChange}
                disabled ={true}
              />

            </div>
            <div className="form-group mt-3">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                className="form-control mt-1"
                placeholder="Enter Last Name"
                value={values.last_name} 
                onChange={handleInputChange}
                disabled ={true}
              />
            </div>

            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-control mt-1"
                placeholder="Enter Username"
                value={values.username} 
                onChange={handleInputChange}
                disabled ={true}
              />
            </div>

            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type={isShown ? "text" : "password"}
                name="password"
                className="form-control mt-1"
                placeholder="Enter New Password"
                onChange={(e)=>setPassword(e.target.value)}
              />
               <div className="error-text">{passError}</div>
            </div>

            <div class="right">
            <label htmlFor="checkbox">Show Password?&nbsp;</label>
            <input id="checkbox" type="checkbox" checked={isShown}  onChange={togglePassword}/>
            </div>

            <div className="form-group mt-3">
              <label>Can Edit?</label>
            <select name="canEdit"  id="canEditDropdown" className="form-control mt-1" onChange={handleInputChange} placeholder ={values.canEdit} defaultValue={values.canEdit}>
            <option value="" disabled selected hidden>{values.canEdit=== "true" ? "Yes":"No"}</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
             </select>
            </div>
            <br></br>
            <br></br>
            <div className="newuser-btn-add">
              <button onClick={updateUser} type="submit" className="btn btn-primary-add">
                Save
              </button>
              
              <button onClick={(e)=>{e.preventDefault(); if(window.confirm("Are you sure you want to cancel?")){Cancel()}}} className="btn btn-primary-cancel">
                Cancel
              </button>
            </div>
          </div>
        </form>
 
      </div>
          </NavWrapper>
    );
};


export default UserUpdate;
