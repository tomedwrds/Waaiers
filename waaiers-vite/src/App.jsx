import './App.css';
import './private/APIKey.js';

import Navbar from './navbar/Navbar.jsx';

import MainMapPage from './map/MainMapPage';



function App() 
{
  
  
  return (
    <div className="App">
      <Navbar/>
      <MainMapPage/>
    </div>
  );
}








export default App;
