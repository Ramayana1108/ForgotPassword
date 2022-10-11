
import Navbar from "./Navbar";
import {useState} from 'react'


const NavWrapper = ({children}) => {

  const styles = {
    position: "absolute",
    width: "100%",
    // float: "left",
    // left: '200px',
    transition: '850ms',
    overflow: 'auto'
  }

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(prevState => !prevState);

  return (
    <>
        <Navbar sidebar={sidebar} showSidebar={showSidebar}/>
        <div className="list" style={sidebar ? styles : null}>  
            {children}
        </div>
    </>
  );
};

export default NavWrapper;