import React, { useState, useEffect } from "react";
import AnimalarchiveDatatable from "../../components/datatables/animalarchiveDatatable";
import NavWrapper from "../../components/navbar/NavWrapper";

const  AnimalarchiveList = () => {
  return (
    //   <div>
    //     <Navbar/>
    //     <div className="list">  
    //     <div className="listContainer">
    //     <AnimalarchiveDatatable/>
    //   </div>
    // </div>
    // </div>
  <NavWrapper>
    <AnimalarchiveDatatable/>
  </NavWrapper>
  );
};

export default AnimalarchiveList;