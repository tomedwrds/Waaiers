
import './navbar.css'
import { useState } from "react";
import { Link } from 'react-router-dom';
import logo from './logo.jpg'


function Navbar() {
    //State hook stores wether the popdown menu is expanded
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    
    return (
      <nav className="navigation">
        <div className='top-navbar'>
        <div className = "logo">
        <a href="/" className="brand-name">
       <img src={logo} className='logo-image' />
      
        </a>
        </div>
        <div className='links'>
        <div className = 'hamburger-container'>
        <button
        className="hamburger"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
        >
       
        
            {/* burger icons from heroicons.com */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill=" #00121c">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
           </div>
          {/* Nav menu is rendered diffrently depedent on wether the nav menu is expanded or closed */}
          <div
          className={
           "navigation-menu"}>
            <ul>
              {/* Link makes use of client side routing, meaning a full document request is not done */}
              <li>
                <Link className = "links-text" to="races">Races</Link>
              </li>
              <li>
                <Link className = "links-text" to="load">Try Yourself</Link>
              </li>
              <li>
                <Link className = "links-text" to="login">Login</Link>
              </li>
            </ul>

            </div>
        </div>
        </div>
        <div className='pop-up' style = {{display: isNavExpanded == true ?'flex': 'none'}}>
          <div className = 'pop-up-links'>
        <ul>
              {/* Link makes use of client side routing, meaning a full document request is not done */}
              <li>
                <Link className = "popup-links-text" to="races">Races</Link>
              </li>
              <li>
                <Link className = "popup-links-text" to="load">Try Yourself</Link>
              </li>
              <li>
                <Link className = "popup-links-text" to="login">Login</Link>
              </li>
            </ul>
            </div>
        </div>
      </nav>
      
    );
  }


  export default Navbar;