import './App.css';

import { Outlet } from 'react-router-dom';

import Navbar from './navbar/Navbar.jsx';
import Footer from './footer/Footer.jsx';



//Navbar is rednered then below it the outlet component is placed
//Outlet indicated where we wish to render the child routes
function App() 
{
  
  return (
    <div className="App">
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  );
}








export default App;
