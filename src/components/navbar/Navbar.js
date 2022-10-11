import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';
import { Link } from 'react-router-dom';
import { SidebarDataAdmin, SidebarDataStaff} from './SidebarData';
import "./Navbar.scss";
import { IconContext } from 'react-icons';

function Navbar({showSidebar, sidebar}) {

  const role = sessionStorage.getItem("role");


  if (role ==="Admin"){
    return(
      <>
        <IconContext.Provider value={{ color: '#fff' }}>
          <div className='navbar'>
            <div className={sidebar ? 'menu-bars' : 'menu-bars-close'}>
              <FaIcons.FaBars onClick={showSidebar} />
            </div>
          </div>
          <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items' onClick={showSidebar}>
              <li className='navbar-toggle'>
                <div className='menu-bars'>
                  <MdIcons.MdClose />
                </div>
              </li>
              {SidebarDataAdmin.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      <span className="navbar-icons">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              }) 
               }
            </ul>
          </nav>
        </IconContext.Provider>
      </>
    );
  }else{
    return(
      <>
        <IconContext.Provider value={{ color: '#fff' }}>
          <div className='navbar'>
            <div className={sidebar ? 'menu-bars' : 'menu-bars-close'}>
              <FaIcons.FaBars onClick={showSidebar} />
            </div>
          </div>
          <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items' onClick={showSidebar}>
              <li className='navbar-toggle'>
                <div className='menu-bars'>
                  <MdIcons.MdClose />
                </div>
              </li>
              {SidebarDataStaff.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      <span className="navbar-icons">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              }) 
               }
            </ul>
          </nav>
        </IconContext.Provider>
      </>
    );
  
 
}

}

export default Navbar;
