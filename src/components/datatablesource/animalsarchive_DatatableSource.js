export const animalColumns = [
    {
      field: "animal_imageurl",
      headerName: "Image",
      headerAlign: 'center',
      align: 'center',
      flex:1,
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.animal_imageurl} />
          </div>
        );
      },
    },
    {
      field: "animal_name",
      headerName: "Name",
      width: 230,
      headerAlign: 'center',
      align: 'center',
      flex:1,
    },
  
    {
      field: "animal_enclosure",
      headerName: "Enclosure",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      flex:1,
    },
  ];
  