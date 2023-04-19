
import './navbar.css'
import { useState } from "react";
import { Link } from 'react-router-dom';


function Navbar() {
    //State hook stores wether the popdown menu is expanded
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    
    return (
      <nav className="navigation">
        <a href="/" className="brand-name">
          Waaiers
        </a>

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
            fill="white"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* Nav menu is rendered diffrently depedent on wether the nav menu is expanded or closed */}
        <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
          <ul>
            {/* Link makes use of client side routing, meaning a full document request is not done */}
            <li>
              <Link to="home">Home</Link>
            </li>
            <li>
              <Link to="load">Load</Link>
            </li>
            <li>
              <Link to="races">Races</Link>
            </li>
            <li>
              <Link to="login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }


  export default Navbar;