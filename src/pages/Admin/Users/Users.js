import React, { useState, useEffect } from "react";
import Datatable from "../../../components/datatables/userDatatable";
import "./Users.scss"
import NavWrapper from "../../../components/navbar/NavWrapper";
// import NavWrapper from '..NavWrapper';
const  UsersList = () => {

  const styles = {
    position: "absolute",
    width: "85%",
    left: "15%",
    transition: '850ms'
  }

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(prevState => !prevState);
  return (
    
      <NavWrapper>
        <Datatable />
      </NavWrapper>
  );
};

export default UsersList;