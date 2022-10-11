import "./Aboutus.scss"
import AboutusDatatable from "../../components/datatables/aboutusDatatable";
import NavWrapper from "../../components/navbar/NavWrapper";

const  Aboutus = () => {
    return (
        <div>
          <NavWrapper>
            <AboutusDatatable/>
          </NavWrapper>
          
        </div>
    );
  };
  
  export default Aboutus;