import './App.css';

import { Outlet } from 'react-router-dom';

import Navbar from './navbar/Navbar.jsx';




//Navbar is rednered then below it the outlet component is placed
//Outlet indicated where we wish to render the child routes
function App() 
{
  fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m")
  .then(response =>{
    return response.json();
  })
  .then(users=>{
    console.log(users)
  })
  return (
    <div className="App">
      <Navbar/>
      <Outlet/>
    </div>
  );
}








export default App;
