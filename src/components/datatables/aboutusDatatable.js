import "./Css/aboutusdatatable.scss";

import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../datatablesource/aboutus_DatatableSource";
import { useEffect, useState } from "react";
import { Link,Navigate,useNavigate } from 'react-router-dom';

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,where, query
} from "firebase/firestore";
import { db } from "../../services/firebase-config";

const AboutusDatatable = () => {
  const navigate = useNavigate();
  const colUserRef = collection(db,"Users");
  const uname = sessionStorage.getItem("username");
  const [permission, setPermission] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "aboutus"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        console.log(list[0])
        
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    getPermission();
  }, []);


  function getPermission(){
    const q = query(colUserRef, where("username","==",uname));  
    let userRole= [];
    getDocs(q).then(async (response) => {
      userRole =  response.docs.map((doc) => ({
      permission: doc.data().canEdit,
    }));  
    setPermission(userRole[0].permission);
  })
  }

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      headerAlign: 'center',
      align: 'center',
      width: 200,
      flex:.75,
      renderCell: (params) => {
        return (
          <div className="cellAction"> 
          <button
              className="updateButton"
              hidden={String(permission)==="true"? false:true}
              onClick={() => navigate('/updateaboutus',{state: {abtid:params.row.id}})}
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];
  return (
     
    <div className="datatable">
      <div className="datatableTitle">
        <h1 style={{color: "black"}}>About Us</h1>
      </div>
      <DataGrid
        rowHeight={400}
        rowsPerPageOptions={[1]}
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        disableColumnFilter={true}
        disableColumnMenu={true}
        disableColumnSelector={true}
        hideFooter={true} 
      />
      </div>
  );
};

export default AboutusDatatable;
