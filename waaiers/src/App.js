import './App.css';
import './private/APIKey.js';
import gpxdata from './racedata/omloophetnieuwsblad2023.js';

import getMetServiceApiKey from './private/APIKey.js';

const gpxParser = require('gpxparser');
const gpx = new gpxParser(); //Create gpxParser Object
gpx.parse(gpxdata); //parse gpx file from string data


function distanceBetweenGPXPoints(lat1,lat2,lon1,lon2)
{
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres

  return d;
  
}

function bearingBetweenGPXPoints(lat1,lat2,lon1,lon2)
{
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;

  const y = Math.sin(lon2-lon1) * Math.cos(lat2);
  const x = Math.cos(lat1)*Math.sin(lat2) -
            Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  const θ = Math.atan2(y, x);
  const brng = (θ*180/Math.PI + 360) % 360; // in degrees

  return brng;


}


//GPX data must next be seralized into a format to make the api call
const gpxPoints = gpx.tracks[0].points;
let distance = 0;

//Bearing / wind bearing
const directionData =[];

//I am limited by the amount of metservice api calls I can make.
//Therefore only a cordinate is stored for every 15km and wind speed/ direction is retrieved at that point and given to all route cordinates
for(let i = 0; i < gpxPoints.length-1; i++)
{
  console.log(bearingBetweenGPXPoints(gpxPoints[i].lat, gpxPoints[i+1].lat,gpxPoints[i].lon, gpxPoints[i+1].lon));
  distance += distanceBetweenGPXPoints(gpxPoints[i].lat, gpxPoints[i+1].lat,gpxPoints[i].lon, gpxPoints[i+1].lon);




} 

console.log(distance);



let url = 'https://forecast-v2.metoceanapi.com/point/time';

let data = {
  points: [{lon: 174.7842, lat: -37.7935},{lon: 173.7842, lat: -37.7935},{lon: 114.7842, lat: -37.7935}],
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
  return (
    <div className="App">
      <input type="file"/>
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
