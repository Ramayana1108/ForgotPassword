export const userColumns = [
  {
    field: "abt_image",
    headerName: "Image",
    headerAlign: 'center',
    align: 'center',
    flex:1,
   
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" width="400" 
       height="500" src={params.row.abt_image} />
        </div>
      );
    },
  },
  {
    field: "abt_description",
    headerName: "Description",
    headerAlign: 'center',
    align: 'center',
    flex:1,
  },
  
];
