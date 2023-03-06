import './App.css';
import './private/APIKey.js';
import { useState } from 'react';


import setLineColor from './map/setLineColor';


import getMetServiceApiKey from './private/APIKey.js';
import GPXIntalizeFile from './gpx/GPXIntalizeFile';
import RouteWindMap from './map/RouteWindMap';

import { MapContainer,TileLayer } from 'react-leaflet';







const fetchWeatherData = async (gpxPoints,weatherAPIData,setPositions)=>
{

  const raceTime = '2023-03-05T12:00:00Z'

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

  let response = await fetch(url, options);
  console.log('API response status:', response);
  
  let json = await response.json();

  //Retrieve the data from the API call
  const returnedData = json.variables;
  const windDirection = returnedData['wind.direction.at-10m'].data;
  const windSpeed = returnedData['wind.speed.at-10m'].data;
  const windSpeedGust = returnedData['wind.speed.gust.at-10m'].data;

  const positions = [];
  const kmInterval = 100;
  //With the returned wind data we now want to assign the value to the km region. As the api was only called for every x km. We also want
  for(let i = 0; i < gpxPoints.length-1; i++)
  {
    //API call is made for every km of a set interval.
    //This function gets the data from the nearest km interval and attaches it to the gpx point
    const apiCallPoint = Math.round(gpxPoints[i].distance_start/kmInterval/1000);
    
    gpxPoints[i].wind_direction = windDirection[apiCallPoint];
    gpxPoints[i].wind_speed = windSpeed[apiCallPoint];
    gpxPoints[i].wind_speed_gust = windSpeedGust[apiCallPoint];

    //Get the relative wind direction ie the direcion of the wind from behind the rider 0deg tail wind 180deg headwind
    //Wind direction is viewed as the direction the wind came from therefore it needs to be shifted by 180 to get a value of direction wind  came from
    const invertedWindDirection = (gpxPoints[i].wind_direction + 180) % 360;
    let windRouteRelativeDirection = gpxPoints[i].route_dir - invertedWindDirection;

    //Modulos doesnt work for negative numbers so 360 must be added if less than 0
    if(windRouteRelativeDirection < 0) windRouteRelativeDirection += 360;
    gpxPoints[i].wind_route_realtive = windRouteRelativeDirection;

    //We can then classify the wind direction based on this relative value
    //330 - 30 tailwind
    //30 - 90 & 270 - 330 cross tailwind
    //150 - 210 head wind 
    //90 - 150 & 210 - 270 cross head wind
    if(windRouteRelativeDirection >= 330 || windRouteRelativeDirection < 30)
    {
      gpxPoints[i].wind_classifcation = "Tailwind";
    }
    else if(windRouteRelativeDirection >= 150 && windRouteRelativeDirection < 210)
    {
      gpxPoints[i].wind_classifcation = "Headwind";
    }
    else if((windRouteRelativeDirection >= 30 && windRouteRelativeDirection < 90) || (windRouteRelativeDirection >= 270 && windRouteRelativeDirection < 330))
    {
      gpxPoints[i].wind_classifcation = "Cross Tailwind";
    }
    else if((windRouteRelativeDirection >= 90 && windRouteRelativeDirection < 150) || (windRouteRelativeDirection >= 210 && windRouteRelativeDirection < 270))
    {
      gpxPoints[i].wind_classifcation = "Cross Headwind";
    }

    //On the map polylines are rendered to display the route
    //This function breaks up the route into smaller segments depdent on the wind classifcation 
    //This allows diffrent styling to be applied to the broken up polyline segment
    //Interactive data can also be added ie popups.
    
    if(positions.length == 0)
    {
      //In case of first segment an inital item must be added
      positions.push({id: 0, class:gpxPoints[i].wind_classifcation, linecolor: setLineColor(gpxPoints[i].wind_classifcation), latlon: [[gpxPoints[i].lat,gpxPoints[i].lon]],kmStart: 0, kmEnd: 0})

    } 
    else
    {
      //Get the current line segment 
      const currentLineSegment = positions[positions.length-1];
      
      //Check if the classifcation of wind has changed if so a new segment should be rendered
      //Incases where the classifcation is the same we cant to add the cords to the prior segment
      if(currentLineSegment.class != gpxPoints[i].wind_classifcation)
      {
        //Prior to adding a new polyline in a final point is added to the prior polyline to join them togehter
        //If the prior polyline was only a single point it an be removed
        if(currentLineSegment.latlon.length == 1)
        {
          positions.pop();
        }
        else
        {
          currentLineSegment.latlon.push([gpxPoints[i].lat,gpxPoints[i].lon]);
          currentLineSegment.kmEnd = gpxPoints[i].distance_end;
        }
       

        positions.push({id: positions.length, class:gpxPoints[i].wind_classifcation, linecolor: setLineColor(gpxPoints[i].wind_classifcation), latlon: [[gpxPoints[i].lat,gpxPoints[i].lon]],kmStart: gpxPoints[i].distance_start, kmEnd: 0})
      }
      else
      {
        currentLineSegment.latlon.push([gpxPoints[i].lat,gpxPoints[i].lon]);
      }
    }

  } 






  setPositions(positions);
  

}





const IntrestSegmentContainer = (props) =>
{
  if(props.data != null)
  {
    console.log(props)
    return(
      <div className='intrestSegmentContainer'>
        <IntrestSegment data = {props.data[0]}/>
        <IntrestSegment data = {props.data[1]}/>
        <IntrestSegment data = {props.data[1]}/>
        <IntrestSegment data = {props.data[1]}/>
      </div>
    )
  }
}

const IntrestSegment = (props) =>
{
    const segmentData = props.data
    const kmStart = ((segmentData.kmStart)/1000).toFixed(1)
    const kmEnd = ((segmentData.kmEnd)/1000).toFixed(1)
    console.log(props.data)
    return(
      <div className = "intrestSegment">
        <p>{kmStart}km - {kmEnd}km | Difficulty: ⭐⭐⭐</p>
       
        <p>Wind Direction: lorem | Wind Speed: Ipsum</p>
      
        <div className='mapContainer'>
          <div id="map" >
          <MapContainer doubleClickZoom = {false}  zoomControl = {false} center={segmentData.latlon[0]} zoom={16} scrollWheelZoom={false} dragging = {false}>
              <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
          
          </MapContainer>
          </div>
        </div>
      </div>
    )
  
}







function App() 
{
  //GPXIntalizeFile returns array 0 - gpxPoints, 1- weatherAPIData
  const intalizedGPXData = GPXIntalizeFile();
  
  const gpxPoints = intalizedGPXData[0];
  const weatherAPIData = intalizedGPXData[1];
  
  const [positions,setPositions] = useState(null);
  
  return (
    <div className="App">
      <input type="file"/>
      <button onClick={()=> {fetchWeatherData(gpxPoints,weatherAPIData,setPositions)}}>Call Api</button>
      <button onClick={()=>console.log(positions)}> Api</button>
     
        <RouteWindMap data = {positions} />
      
  
      <IntrestSegmentContainer data = {positions}/>
    </div>



  );
}








export default App;
