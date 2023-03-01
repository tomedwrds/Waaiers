import './App.css';
import './private/APIKey.js';
import getMetServiceApiKey from './private/APIKey.js';



let url = 'https://forecast-v2.metoceanapi.com/point/time';

let data = {
  points: [{lon: 174.7842, lat: -37.7935}],
  variables: ['wave.height'],
  time: {
    from: '2023-02-28T00:00:00Z',
    interval: '3h',
    repeat: 3,
  }
};

let options = {
  method: 'post',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': getMetServiceApiKey() //API is stored in private file so it cant be stolen and malsicsoly used
  }
};







function App() {
  console.log('f');
  return (
    <div className="App">
     <button onClick={fetchWeatherData}>Call Api</button>
    </div>
  );
}

const fetchWeatherData = async ()=>
{
  let response = await fetch(url, options);
  console.log('API response status:', response.status);
  
  let json = await response.json();
  console.log('API response JSON:', json.dimensions );
}

export default App;
