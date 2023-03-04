import distanceBetweenGPXPoints from './distanceBetweenGPXPoints';
import bearingBetweenGPXPoints from './bearingBetweenGPXPoints';
import gpxdata from '../racedata/omloophetnieuwsblad2023.js';


function GPXIntalizeFile ()
{
    const gpxParser = require('gpxparser');
    const gpx = new gpxParser(); //Create gpxParser Object
    gpx.parse(gpxdata); //parse gpx file from string data



    //GPX data must be seralized into a format friendly to the leaflet react library
    //This is an array of lat, long cordinates
    const gpxPoints = gpx.tracks[0].points;

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

    return [gpxPoints,weatherAPIData]
}

export default GPXIntalizeFile;