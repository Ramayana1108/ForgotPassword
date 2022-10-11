import "./Chatbot.scss"
import ChatbotDatatable from "../../components/datatables/chatbotDatatable";
import NavWrapper from "../../components/navbar/NavWrapper";

const  ChatbotList = () => {
    return (
        <div>   
          <NavWrapper>
            <ChatbotDatatable/>     
          </NavWrapper>             
        </div>
    );
  };
  
  export default ChatbotList;