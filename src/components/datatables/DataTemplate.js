import "./Css/chatbotdatatable.scss";

import { DataGrid } from "@mui/x-data-grid";
import { chatColumns } from "../datatablesource/chatbotDatatableSource";
import { useEffect, useState } from "react";
import { Link,Navigate,useNavigate } from 'react-router-dom';
import Sidebar from "../bars/Sidebar";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../services/firebase-config";

const DataTemplate = ({collectionName, listColumn, actionColumn, link}) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, collectionName),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);


  return (
  <div>
    <div className="col-12 col-md-2">
        <Sidebar />
    </div>
    <div className="datatable">
      <div className="datatableTitle">
      <Link to={link} className="link">
          Add New
        </Link>
      </div>
     
      <DataGrid
        className="datagrid"
        rows={data}
        columns={listColumn.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        
      />
      </div>
      </div>
  );
};

export default DataTemplate;
