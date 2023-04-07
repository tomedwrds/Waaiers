import distanceBetweenGPXPoints from './distanceBetweenGPXPoints';
import bearingBetweenGPXPoints from './bearingBetweenGPXPoints';
import gpxdata from '../racedata/omloophetnieuwsblad2023.js';


import { XMLParser } from 'fast-xml-parser';


function GPXIntalizeFile ()
{

    const parser = new XMLParser();
    let jObj = parser.parse(gpxdata);
    console.log(jObj)
    // const gpxParser = require('gpxparser');
    // const gpx = new gpxParser(); //Create gpxParser Object
    // gpx.parse(gpxdata); //parse gpx file from string data



    // //GPX data must be seralized into a format friendly to the leaflet react library
    // //This is an array of lat, long cordinates

    // let gpxPoints = [];
    // const parsedPoints = gpx.tracks[0].points;

    // let distance = 0;

    // //I am limited by the amount of metservice api calls I can make on the free metservice plan
    // //Therefore only a cordinate is stored for every 15km and wind speed/ direction is retrieved at that point and given to all route cordinates within the 15km bounds
    // const weatherAPIData =[];
    // const kmInterval = 15;


    // //We also want to add a distance start value, distance end value for every gpx point and direction
    // for(let i = 0; i < parsedPoints.length-1; i++)
    // {
    //     //First check if any overlap exists between lat/lon.
    //     //If so these points should be removed as the break the bearing calculations
    //     if(!(parsedPoints[i].lat == parsedPoints[i+1].lat || parsedPoints[i].lon == parsedPoints[i+1].lon))
    //     {
            
    //     let gpxPoint = {lat: parsedPoints[i].lat,lon: parsedPoints[i].lon}

    //     //Set the distance start value
    //     gpxPoint.distance_start = distance;
        
    //     //Increment the distance travelled
    //     distance += distanceBetweenGPXPoints(parsedPoints[i].lat, parsedPoints[i+1].lat,parsedPoints[i].lon, parsedPoints[i+1].lon);

    //     //Set the distance end value
    //     gpxPoint.distance_end = distance;

    //     //Set the direction travelled
    //     gpxPoint.route_dir = bearingBetweenGPXPoints(parsedPoints[i].lat, parsedPoints[i+1].lat,parsedPoints[i].lon, parsedPoints[i+1].lon);
        
    //     //Save the lat and lon for every interval travelled to the weather api file
    //     const distanceKm = distance/1000;
        
    //     if((Math.floor(distanceKm) % kmInterval === 0) && (Math.floor(distanceKm/kmInterval) === weatherAPIData.length))
    //     {
    //         weatherAPIData.push({lon: parsedPoints[i].lon, lat: parsedPoints[i].lat});
    //     }
    
    //     gpxPoints.push(gpxPoint)
    //     }
        
    
    // } 

    // return [gpxPoints,weatherAPIData]
}

export default GPXIntalizeFile;