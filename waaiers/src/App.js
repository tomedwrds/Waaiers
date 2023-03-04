import './App.css';
import './private/APIKey.js';
import gpxdata from './racedata/omloophetnieuwsblad2023.js';

import { MapContainer,TileLayer,Marker,Popup,Polyline } from 'react-leaflet'

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

  const y = Math.sin(lon2-lon1) * Math.cos(lat2);
  const x = Math.cos(lat1)*Math.sin(lat2) -
            Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  const θ = Math.atan2(y, x);
  const brng = (θ*180/Math.PI + 360) % 360; // in degrees

  return brng;


}


//GPX data must be seralized into a format friendly to the leaflet react library
//This is an array of lat, long cordinates
const gpxPoints = gpx.tracks[0].points;
const positions = gpxPoints.map(p => [p.lat, p.lon]);
let distance = 0;

//I am limited by the amount of metservice api calls I can make on the free metservice plan
//Therefore only a cordinate is stored for every 15km and wind speed/ direction is retrieved at that point and given to all route cordinates within the 15km bounds
const weatherAPIData =[];
const kmInterval = 100;


//We also want to add a distance start value, distance end value for every gpx point and direction
for(let i = 0; i < gpxPoints.length-1; i++)
{
  //Set the distance start value
  gpxPoints[i].distance_start = distance;
  
  //Increment the distance travelled
  distance += distanceBetweenGPXPoints(gpxPoints[i].lat, gpxPoints[i+1].lat,gpxPoints[i].lon, gpxPoints[i+1].lon);

  //Set the distance end value
  gpxPoints[i].distance_end = distance;

  //Set the direction travelled
  gpxPoints[i].route_dir = bearingBetweenGPXPoints(gpxPoints[i].lat, gpxPoints[i+1].lat,gpxPoints[i].lon, gpxPoints[i+1].lon);
  
  //Save the lat and lon for every interval travelled to the weather api file
  const distanceKm = distance/1000;
  
  if((Math.floor(distanceKm) % kmInterval === 0) && (Math.floor(distanceKm/kmInterval) === weatherAPIData.length))
  {
    weatherAPIData.push({lon: gpxPoints[i].lon, lat: gpxPoints[i].lat});
  }
} 



const raceTime = '2023-03-04T12:00:00Z'

const url = 'https://forecast-v2.metoceanapi.com/point/time';

const data = {
  points: weatherAPIData,
  variables: ['wind.direction.at-10m','wind.speed.at-10m','wind.speed.gust.at-10m'],
  time: {
    from: raceTime,
    interval: '3h',
    repeat: 0,
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


const fetchWeatherData = async ()=>
{
  let response = await fetch(url, options);
  console.log('API response status:', response);
  
  let json = await response.json();

  //Retrieve the data from the API call
  const returnedData = json.variables;
  const windDirection = returnedData['wind.direction.at-10m'].data;
  const windSpeed = returnedData['wind.speed.at-10m'].data;
  const windSpeedGust = returnedData['wind.speed.gust.at-10m'].data;

  //With the returned wind data we now want to assign the value to the km region. As the api was only called for every x km. We also want
  for(let i = 0; i < gpxPoints.length-1; i++)
  {
    //API call is made for every km of a set interval.
    //This function gets the data from the nearest km interval and attaches it to the gpx point
    const apiCallPoint = Math.round(gpxPoints[i].distance_start/kmInterval/1000);
    
    gpxPoints[i].wind_direction = windDirection[apiCallPoint];
    gpxPoints[i].wind_speed = windSpeed[apiCallPoint];
    gpxPoints[i].wind_speed_gust = windSpeedGust[apiCallPoint];
  } 

  
}








function App() {
  
  return (
    <div className="App">
      <input type="file"/>
      <button onClick={fetchWeatherData}>Call Api</button>
      <div id="map">
      <MapContainer center={positions[0]} zoom={10} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
	            pathOptions={{ fillColor: 'red', color: 'blue' }}
	            positions={positions}
              eventHandlers={{
                mouseover: ()=>(console.log("fff"))
              }}
              
            />
      </MapContainer>
      </div>
    </div>
  );
}








export default App;
