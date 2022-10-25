import "../datatables/Css/datatable.scss"
import { DataGrid } from "@mui/x-data-grid";
import { animalColumns } from "../datatablesource/animals_DatatableSource";
import { useEffect, useState } from "react";
import { Link,Navigate,useNavigate } from 'react-router-dom';


import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot, where, query,updateDoc
} from "firebase/firestore";
import { db } from "../../services/firebase-config";
import { FilterDrama } from "@mui/icons-material";

const AnimalDatatable = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const uname = sessionStorage.getItem("username");
  const [permission,setPermission] = useState();

  //animal query
  const colRef = collection(db,"animals");
  const q = query(colRef, where("animal_archive","==",false))

  // initializing arrays
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState(null);
  const colUserRef = collection(db,"Users");
 
  useEffect(() => {
    const unsub = onSnapshot(       
      q,
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });           
            });

        setData(list);
        setFilteredData(list);
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
    setFilteredData(data.filter(item => item?.animal_name.toLowerCase().includes(search.toLowerCase()) || item?.animal_enclosure.toLowerCase().includes(search.toLowerCase())))
  }, [search]);

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

  const handleArchive= async (animalId) => {
  
    const docRef = doc(db,'animals',animalId);
   
        updateDoc(docRef,{
            animal_archive: true
        } ).then(response => {
          alert("Animal archived successfully.")
        }).catch(error =>{
          console.log(error.message)
        })
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      headerAlign: 'center',
      align: 'center',
      flex:.5,
      width: 200,
      sort:false,
      renderCell: (params) => {
        return (
          <div className="cellAction"> 
          <button
              className="updateButton"
              onClick={() => {navigate('/updateanimals',{state: {aid:params.row.id}});}}
              hidden={String(permission)==="true"? false:true}
            >
              Edit
            </button>
          
            <div
              className="deleteButton"
              hidden={role === 'Staff' ? true : false}
              onClick={() => {if(window.confirm("Are you sure you want to archive this animal?")){handleArchive(params.row.id)}}}
            >
              Archive
            </div>
            <div>
            </div>
          </div>
        );
      },
    },
  ];
  return (

    <div className="datatable">
      <div className="datatableTitle">
      <h1 style={{color: "black"}}>Animals</h1>
      <Link to="/newanimals" className="link" hidden={String(permission)==="true"? false:true}>
          Add New
        </Link>
      </div>
      <input type="text" onChange={ (e) => setSearch(e.target.value)} placeholder="Search" className="search-bar"/>
      <DataGrid
        rowHeight={400}
        autoHeight
        className="datagrid"
        rows={filteredData}
        columns={animalColumns.concat(actionColumn)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableColumnFilter={true}
        disableColumnMenu={true}
        disableColumnSelector={true}
      
      />
      
      </div>
  );
};

export default AnimalDatatable;
