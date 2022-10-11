import "../datatables/Css/datatable.scss"
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../datatablesource/user_DatatableSource";
import { useEffect, useState } from "react";
import { Link,Navigate,useNavigate } from 'react-router-dom';
import "../datatables/Css/userDatatable.scss"


import {
  collection,getDoc,
  getDocs,
  deleteDoc,
  doc,addDoc,
  onSnapshot, where, query,updateDoc
} from "firebase/firestore";
import { db } from "../../services/firebase-config";


const Datatable = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState(null);


    //user query
    const colRef = collection(db,"Users");
    const q = query(colRef, where("role","==","Staff"))
  


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
      setFilteredData(data.filter(item => item?.first_name.toLowerCase().includes(search.toLowerCase()) || item?.last_name.toLowerCase().includes(search.toLowerCase()) || item?.username.toLowerCase().includes(search.toLowerCase())))
  }, [search])


  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, "Users", userId));
      alert("User deleted successfully.");
    } catch (err) {
      console.log(err);
    }
  };
 

  const actionColumn = [
    
    {
      field: "action",
      headerName: "Action",
      width: 200,
      headerAlign: 'center',
      align: 'center',
      flex:.75,
      renderCell: (params) => {
        return (
          <div className="cellAction"> 
          <button
              className="updateButton"
              onClick={() => navigate('/updateUser',{state: {userid:params.row.id}})}
            >
              Edit
            </button>
          
            <div
              className="deleteButton" style={{backgroundColor: "white", color: "#c4391d", borderColor: "#c4391d"}}
              hidden={params.row.role === 'Admin' ? true : false}
              onClick={() =>{if(window.confirm("This action cannot be undone. Are you sure you want to delete this user?")){handleDelete(params.row.id)}}} 
            >
              Delete
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
        <h1 style={{color: "black"}}>Admin Staff</h1>
      <Link to="/newUser" className="link">
          Add New
        </Link>
      </div>
      <input type="text" onChange={ (e) => setSearch(e.target.value)} placeholder="Search" className="search-bar"/>
      <br></br>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
      />

      </div>
  );
};

export default Datatable;
