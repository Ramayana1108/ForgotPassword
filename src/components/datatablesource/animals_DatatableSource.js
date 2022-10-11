import { autocompleteClasses } from "@mui/material";

export const animalColumns = [
    {
      field: "animal_imageurl",
      headerName: "Image",     
      headerAlign: 'center',
      align: 'center',
      flex:1,
      width:300,
      sort:false,
      renderCell: (params) => {
        return (
          <div className="cellWithImg" >
            <img width="250" height="250" 
             className="cellImg" src={params.row.animal_imageurl} />
          </div>
        );
      },
    },
    {
      field: "animal_name",
      headerName: "Name",
      headerAlign: 'center',
      align: 'center',
      flex:.75,
      width:300,
      sort:false,
    },
  
    {
      field: "animal_enclosure",
      headerName: "Enclosure",
      headerAlign: 'center',
      align: 'center',
      flex:.75,
      width:300,
      sort:false,
    },

  ];
  