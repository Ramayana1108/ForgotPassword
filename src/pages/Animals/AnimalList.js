import React, { useState, useEffect } from "react";
import AnimalDatatable from "../../components/datatables/animalsDatatable";
// import Navbar from "../../components/navbar/Navbar";
import NavWrapper from '../../components/navbar/NavWrapper';

const  AnimalList = () => {
  console.log("report page")
  return (
    //   <div>
    //     <Navbar/>
    //     <div className="list">  
    //     <div className="listContainer">
    //     <AnimalDatatable/>
    //   </div>
    // </div>
    // </div>
    <NavWrapper>
      <AnimalDatatable/>
    </NavWrapper>
  );
};

export default AnimalList;