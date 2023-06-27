
import './navbar.css'
import { Link } from 'react-router-dom';
import logo from './logo.jpg'

import { useEffect, useState,useRef } from "react";
import supabase from "../supabase/supabase"

function Navbar() {
    //State hook stores wether the popdown menu is expanded
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const [userSignedIn,setUserSignedIn] = useState(null);

  

    //USER LOGIN / OUT
    //Below are a range of async functions that handle session getting login and sign out
    async function getSession()
    {
        const { data, error } = await supabase.auth.getSession();

        if(data.session)
        {
            setUserSignedIn(true)
        }
        else
        {
            setUserSignedIn(false)
        }
    }

    async function googleLogin()
    {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        })

       
    }

    async function signOutUser()
    {
        const { data, error } = await supabase.auth.signOut()
        //Update sign out status if user succesfully signed out
        if(!error)
        {
          setUserSignedIn(false);
        }
        
    }

    //This function is called by the navbar and then is used too update log in out status
    function handleLogInOut()
    {
      if(userSignedIn)
      {
        signOutUser();
      }
      else
      {
        googleLogin();
      }
      
    }


    //On page load check if there is an active session
    useEffect(()=>{
        getSession();

    },[])

   
    // call useFfect adding an event listener. The return ensures it is cleared up
    useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      };
  }, []);
  
    //Code that triggeres on every resize, to check that navbar isnt rendering when it shouldnt
    const handleWindowSizeChange = () => {
        if(window.innerWidth > 768) setIsNavExpanded(false)
       
    };

    
    
    
    



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
                <Link className = "links-text" to="about">FAQ</Link>
              </li>
              <li>
                <Link  onClick = {()=>handleLogInOut()}className = "links-text" >{userSignedIn ? 'Log Out':'Sign In'}</Link>
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
                  <Link className = "popup-links-text" to="about">FAQ</Link>
              </li>
              <li>
                <Link onClick = {()=>handleLogInOut()} className = "popup-links-text" >{userSignedIn ? 'Log Out':'Sign In'}</Link>
              </li>
            </ul>
            </div>
        </div>
      </nav>
      
    );
  }


  export default Navbar;