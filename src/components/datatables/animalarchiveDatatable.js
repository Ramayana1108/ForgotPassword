import React from "react";
import "../datatables/Css/animalarchiveDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { animalColumns } from "../datatablesource/animalsarchive_DatatableSource";
import { useEffect, useState } from "react";
import { Link,Navigate,useNavigate } from 'react-router-dom';
import { ref, deleteObject} from "firebase/storage";
import { getDoc } from "firebase/firestore";



import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot, where, query,updateDoc
} from "firebase/firestore";
import { db, storage } from "../../services/firebase-config";


const AnimalarchiveDatatable = () => {
  const navigate = useNavigate();

  //animal query
  const colRef = collection(db,"animals");
  const q = query(colRef, where("animal_archive","==",true))


// initializing arrays
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState(null);
  const[restoreModalOpen, setRestoreModalOpen] = useState(false);
  const[deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [id,setId]= useState();

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


  const getPathStorageFromUrl=(url)=>{

    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/manilazooproject.appspot.com/o/";
  
     url = url.replace(baseUrl,""); 
  
    let index = url.indexOf("?")
  
    url = url.substring(0,index);
    
    url = url.replace("%2F","/");
  
    return url;
  }


  const handleRestore= async (animalId) => {
    const docRef = doc(db,'animals',animalId);
      console.log(!animalId);
        updateDoc(docRef,{
            animal_archive: false
        } ).then(response => {
          alert("Animal restored successfully.")
        }).catch(error =>{
          console.log(error.message)
        })
  };

  const handleDelete = async (animalId) => {
    const docRef = doc(db,'animals',animalId);
      
    getDoc(docRef).then(doc => {
      const newData = doc.data();      
      const image_url = ref(storage,getPathStorageFromUrl(newData.animal_imageurl));
      deleteObject(image_url)   
      if (newData.animal_sound){
        const sound_url = ref(storage,getPathStorageFromUrl(newData.animal_sound));
        deleteObject(sound_url)  
      }
    
    }).then(()=>{    
        deleteDoc(doc(db,"animals/"+animalId+"/animal_quiz/quiz1"));
        deleteDoc(doc(db,"animals/"+animalId+"/animal_quiz/quiz2"));
        deleteDoc(doc(db,"animals/"+animalId+"/animal_quiz/quiz3"));
        deleteDoc(doc(db,"animals",animalId));          
    }).then(()=>{
      alert("Animal deleted successfully.")
    });
  };
  

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      headerAlign: 'center',
      align: 'center',
      width:300,
      renderCell: (params) => {
        return (
          <div className="cellAction">         
            <div
              className="updateButton"
              hidden={params.row.role === 'Admin' ? true : false}
              onClick={() =>{if(window.confirm("Are you sure you want to restore this animal?")){handleRestore(params.row.id)}}}
            >
              Restore
            </div>
            <button
              className="deleteButton"
              onClick={() => {if(window.confirm("This action cannot be undone. Are you sure you want to delete this animal?")){handleDelete(params.row.id)}}}
            >
              Delete
            </button>
          
            <div
             
            >
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        <h1 style={{color: "black"}}>Animal Archives</h1>
      </div>
      <input type="text" onChange={ (e) => setSearch(e.target.value)} placeholder="Search" className="search-bar"/>
      
      <DataGrid
        className="datagrid"
        rowHeight={400}
        rows={filteredData}
        columns={animalColumns.concat(actionColumn)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableColumnFilter={true}
        disableColumnMenu={true}
        disableColumnSelector={true}
        sortable={false}
      
      />
      
      </div>
     
  );
};

export default AnimalarchiveDatatable;
