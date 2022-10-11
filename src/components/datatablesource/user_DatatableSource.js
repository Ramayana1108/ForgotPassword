export const userColumns = [
   
    {
      field: "first_name",
      headerName: "Name",
      width: 230,
      headerAlign: 'center',
      align: 'center',
      flex:1,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      width: 230,
      headerAlign: 'center',
      align: 'center',
      flex:1,
    },
    {
      field: "username",
      headerName: "Username",
      width: 230,
      headerAlign: 'center',
      align: 'center',
      flex:1,
    },
    {
        field: "role",
        headerName: "Role",
        width: 230,
        headerAlign: 'center',
        align: 'center',
        flex:1,
      },
      {
        field: "canEdit",
        headerName: "Can Edit",
        width: 230,
        headerAlign: 'center',
        align: 'center',
        flex:1,
        renderCell: (params)=>{
          return(
            <div className="cellAction"> 
              {params.row.canEdit=== "true" ? "Yes":"No"}
            </div>
          );
        }
        
      },
      
     
  ];
  