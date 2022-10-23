import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Routes, Route,Outlet,Navigate } from "react-router-dom"



import Users from "./pages/Admin/Users/Users";
import Login from "./pages/Home/Login";
import ResetPassword from "./pages/Home/ResetPassword";
import NewUser from "./pages/Admin/Users/newUsers";
import UserUpdate from "./pages/Admin/Users/userUpdate"
import ChatbotList from "./pages/Chatbot/ManageChatbot";
import ChatbotUpdate from "./pages/Chatbot/chatbotUpdate";
import NewQA from "./pages/Chatbot/chatbotAdd";
import Aboutus from "./pages/AboutUs/Aboutus";
import AboutUsUpdate from "./pages/AboutUs/UpdateAboutus";
import AnimalList from "./pages/Animals/AnimalList";
import ManageAnimal from "./pages/Animals/UpdateAnimal";
import AnimalarchiveList from "./pages/Animals/ArchiveAnimal";
import NewAnimal from "./pages/Animals/NewAnimal";
import Logout from "./pages/Home/Logout";
import ProtectedRoutes from "./services/ProtectedRoutes";
import ForgotPassword from "./pages/Home/ForgotPassword";
import AdminRoutes from "./services/AdminRoutes";


function App() {
  
    return (      
        <div>          
           <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword/:id" element={<ResetPassword />} />
              <Route element={<ProtectedRoutes/>}>

                <Route element={<AdminRoutes/>}>
                  <Route path="/users" element={<Users />} />
                  <Route path="/resetPassword" element={<ResetPassword />} />
                  <Route path="/newUser" element={<NewUser/>}/>
                  <Route path="/updateUser" element={<UserUpdate/>}/>
                  <Route path="/archiveanimals" element={<AnimalarchiveList/>}/>
                </Route>

                <Route path="/chatbot" element={<ChatbotList/>}/>
                <Route path="/updateChatbot" element={<ChatbotUpdate/>}/>
                <Route path="/addChatbot" element={<NewQA/>}/>


                <Route path="/aboutus" element={<Aboutus/>}/>
                <Route path="/updateaboutus" element={<AboutUsUpdate/>}/>

                <Route path="/animals" element={<AnimalList/>}/>
                <Route path="/newanimals" element={<NewAnimal/>}/>
                <Route path="/updateanimals" element={<ManageAnimal/>}/>
              
                <Route path="/logout" element={<Logout/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </div> 
    );
}

export default App;
