
import { db } from "../../services/firebase-config";
import React,{useState, useEffect} from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { collection, query, where,getDocs, doc, getDoc,updateDoc, QuerySnapshot } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import "./chatbotAdd.scss"
import NavWrapper from "../../components/navbar/NavWrapper";

import "./chatbotAdd.scss"

const ChatbotUpdate = () => {
    //Redirecting
    const navigate = useNavigate();

    //getting user
    const getquid = useLocation();
    const qid = getquid.state.qid;

    //kuha data from firebase
    const [data, setData] = useState("");
    const [values, setValues] = useState("");
    const [qError, setQError] = useState("");
    const [aError, setAError] = useState("");
    const [updateQModalOpen, setUpdateQModalOpen] = useState(false);

    const docRef = doc(db,'chatbot',qid);
    
    useEffect(() => {
        getDoc(docRef).then(doc => {
            const newData = doc.data();
            setData(newData);
            setValues(newData);            
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

    //update Database
    function HandleUpdate(e){
        e.preventDefault();
        
        
        if (!values.question && !values.answer ){
          setQError("Please fill out this field.");
          setAError("Please fill out this field.");
        }else if(values.question !=="" && !values.answer ){
          setQError("");
          setAError("Please fill out this field.");
        }else if(!values.question  && values.answer !=="" ){
          setQError("Please fill out this field.");
          setAError("");
        }else{
          setQError("");
          setAError("");
          if(window.confirm("Do you want to save changes?")){
            updateDoc(docRef,{
              question: String(values.question),
              answer: String(values.answer),
             
          } ).then(response => {
            alert("Successfully Updated")
            navigate("/chatbot");
          }).catch(error =>{
            console.log(error.message)
          })
          }      
        }     
    }

    //cancel Button
    function Cancel(){
        navigate("/chatbot")
    }
    
    return(
      <NavWrapper>
      <h1 class="chatbot">Edit Chatbot Response</h1>
      <div className="Auth-form-container-chatadd">
        <form className="Auth-form-chatadd">
          <div className="Auth-form-content-chatadd">
            <div class="center">
            </div>
            
            <div className="form-group mt-3">
              <label>Question</label>
              <input
                type="text"
                className={`form-control mt-1 ${qError ? 'is-invalid':  ''}`}
                placeholder="Enter question"
                name="question" 
                value={values.question} 
                onChange={handleInputChange}
              />
               <div className="error-text">{qError}</div>
            </div>

            <div className="form-group mt-3">
              <label>Answer</label>
              <input
                type="answer"
                className={`form-control mt-1 ${aError ? 'is-invalid':  ''}`}
                placeholder="Enter answer"
                name="answer" 
                value={values.answer} 
                onChange={handleInputChange}
              />
              <div className="error-text">{aError}</div>
            </div>
            <br></br>
            <br></br>
            
            <div className="addChatques-btn-add">
              <button onClick={HandleUpdate} className="btn btn-primary-add">
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


export default ChatbotUpdate;
