import { useState } from 'react';


import GPXIntalizeFile from '../gpx/GPXIntalizeFile';
import RouteWindMap from './RouteWindMap';
import fetchWeatherData from '../weatherAPI/fetchWeatherData';
import IntrestSegmentContainer from '../segments of intrest/IntrestSegmentContainer';

//GPXIntalizeFile returns array 0 - gpxPoints, 1- weatherAPIData
const intalizedGPXData = GPXIntalizeFile();




const MainMapPage = () => {
    
    //Get the GPX points and the associated weather data
    const gpxPoints = intalizedGPXData[0];
    const weatherAPIData = intalizedGPXData[1];

    //Create the postion and segments state hook
    const [positions,setPositions] = useState(null);
    const [segments,setSegments] = useState(null);
    return(
        <div className = "body">
            <button onClick={()=> {fetchWeatherData(gpxPoints,weatherAPIData,setPositions,setSegments)}}>Call Api</button>
            <button onClick={()=>console.log(positions)}> Api</button>
            <h1>Omlopop Het Nieuwsblad</h1>
            <RouteWindMap data = {positions} />
            <h2>Segments of Intrest</h2>
            <IntrestSegmentContainer data = {segments}/>
      </div>
    )
}

export default MainMapPage