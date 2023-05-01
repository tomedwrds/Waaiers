import distanceBetweenGPXPoints from './distanceBetweenGPXPoints';
import bearingBetweenGPXPoints from './bearingBetweenGPXPoints';
import { XMLParser } from 'fast-xml-parser';


function GPXIntalizeFile (gpxData)
{

    //This XML parser ignores attribuites unless told to consider them
    const options = {
        ignoreAttributes : false,
        attributeNamePrefix: "",
        parseAttributeValue: true
    };
    
    const gpxParser = new XMLParser(options);
    const gpx = gpxParser.parse(gpxData);
    


    //GPX data must be seralized into a format friendly to the leaflet react library
    //This is an array of lat, long cordinates

    let gpxPoints = [];
    const parsedPoints = gpx.gpx.trk.trkseg.trkpt;
    
    let distance = 0;

    //I am limited by the amount of metservice api calls I can make on the free metservice plan
    //Therefore only a cordinate is stored for every 15km and wind speed/ direction is retrieved at that point and given to all route cordinates within the 15km bounds
    const weatherAPIData =[];
    const kmInterval = 15;


    //We also want to add a distance start value, distance end value for every gpx point and direction
    for(let i = 0; i < parsedPoints.length-1; i++)
    {
        //First check if any overlap exists between lat/lon.
        //If so these points should be removed as the break the bearing calculations
        if(!(parsedPoints[i].lat == parsedPoints[i+1].lat || parsedPoints[i].lon == parsedPoints[i+1].lon))
        {
                
            let gpxPoint = {point_lat: parsedPoints[i].lat,point_lon: parsedPoints[i].lon, point_elev: parsedPoints[i].ele}

            //Set the distance start value
            gpxPoint.point_distance_start = distance;
            
            //Increment the distance travelled
            distance += distanceBetweenGPXPoints(parsedPoints[i].lat, parsedPoints[i+1].lat,parsedPoints[i].lon, parsedPoints[i+1].lon);

            //Set the distance end value
            gpxPoint.point_distance_end = distance;

            //Set the direction travelled
            gpxPoint.point_dir = bearingBetweenGPXPoints(parsedPoints[i].lat, parsedPoints[i+1].lat,parsedPoints[i].lon, parsedPoints[i+1].lon);
            
            //Save the lat and lon for every interval travelled to the weather api file
            const distanceKm = distance/1000;
            const distanceKmStart = gpxPoint.point_distance_start/1000;
            const distanceKmEnd = gpxPoint.point_distance_end/1000;
            
            
            //The first part checks if distance is an interval and the second that its the only point saved at that interval
            if((distanceKmStart <= kmInterval*weatherAPIData.length && distanceKmEnd >= kmInterval*weatherAPIData.length) && (Math.floor(distanceKm/kmInterval) === weatherAPIData.length))
            {
                weatherAPIData.push({weather_lon: parsedPoints[i].lon, weather_lat: parsedPoints[i].lat});
            }
            
            //the gpx point object then has the id of the corresponding weather point added to it
            gpxPoints.push({...gpxPoint,weather_id: weatherAPIData.length-1})
        }
        
    
    } 
    console.log(gpxPoints)
    
    return [gpxPoints,weatherAPIData]
}

export default GPXIntalizeFile;