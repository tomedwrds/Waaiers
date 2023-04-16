import average from "../generalpurposefunctions/average";


const fetchWeatherData = async (gpxPoints,weatherAPIData,setPositions,setSegments)=>
{

  const raceTime = '2023-04-16T12:00:00Z'

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
      'x-api-key': import.meta.env.VITE_metservice_api_key //API is stored in private file so it cant be stolen and malsicsoly used
    }
  };

  let response = await fetch(url, options);
  console.log('API response status:', response);
  
  let json = await response.json();
  console.log('API response status:', json);

  //Retrieve the data from the API call
  const returnedData = json.variables;
  const windDirection = returnedData['wind.direction.at-10m'].data;
  const windSpeed = returnedData['wind.speed.at-10m'].data;
  const windSpeedGust = returnedData['wind.speed.gust.at-10m'].data;

  let positions = [];
 
  const kmInterval = 15;


  //Segment related constants and data
  let segments = [];
  //The golden angle is the ideal angle for causing cross wind splits
  //An angle of 0 is a tail wind
  const windAngleGolden = 75;
  //Range of angle around the golden angle that would cause splits
  const windAngleZone = 30;
  const minWindSpeed = 0;
  const minSegmentLength = 1000;



  //With the returned wind data we now want to assign the value to the km region. As the api was only called for every x km. We also want
  for(let i = 0; i < gpxPoints.length-1; i++)
  {
    //API call is made for every km of a set interval.
    //This function gets the data from the nearest km interval and attaches it to the gpx point
    const apiCallPoint = Math.floor(gpxPoints[i].distance_start/kmInterval/1000);
    
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


    //On the map polylines are rendered to display the route
    //This allows diffrent styling to be applied to the broken up polyline segment
    //Interactive data can also be added ie popups.
    
    if(positions.length == 0)
    {
      //In case of first segment an inital item must be added
      positions.push({id: 0, latlon: [[gpxPoints[i].lat,gpxPoints[i].lon]],kmStart: 0, kmEnd: 0,segmentWindAngle: [windRouteRelativeDirection],segmentWindSpeed: [gpxPoints[i].wind_speed_gust]})

    } 
    else
    {
      //Get the current line segment 
      let currentLineSegment = positions[positions.length-1];
      
      //Check if the direction of wind relative to the rider has changed enough to warrant the creatio of a new segment
      const segmentSensitivity = 40;
     
      //The wind relative to the rider is averaged from all points on the line
      const averageSectorWind = average(currentLineSegment.segmentWindAngle);
      const upperBound = (averageSectorWind + segmentSensitivity) ;
      let lowerBound = averageSectorWind - segmentSensitivity;
      let inRange = false;

      //Check if outside range
      if(windRouteRelativeDirection >= lowerBound && windRouteRelativeDirection <= upperBound )
      {
        inRange = true
      }
      
      if(!inRange) 
      {
      
        //If the prior polyline was only a single point it an be removed
        if(currentLineSegment.latlon.length == 1 && currentLineSegment.latlon[0] != [gpxPoints[i].lat,gpxPoints[i].lon])
        {
         positions.pop();      
        }
        else
        {

          //Prior to adding a new polyline in a final point is added to the prior polyline to join them togehter
          currentLineSegment.latlon.push([gpxPoints[i].lat,gpxPoints[i].lon]);
          currentLineSegment.segmentWindSpeed.push(gpxPoints[i].wind_speed_gust)
          currentLineSegment.kmEnd = gpxPoints[i].distance_end;

          //Each segment is evalutated to check if it meets minimun criteria to be a segment of intrest
          
          //First length is evalutated
          const segmentLength = currentLineSegment.kmEnd - currentLineSegment.kmStart;
          const segmentLongEnough = segmentLength  > minSegmentLength;

          //Next wind direction
          const segmentWindDir = (average(currentLineSegment.segmentWindAngle) + 360) % 360 
          const segmentWindDirCorrect = (segmentWindDir < (windAngleGolden+windAngleZone) && segmentWindDir > (windAngleGolden-windAngleZone)) || (segmentWindDir < (windAngleGolden+windAngleZone+210) && segmentWindDir > (windAngleGolden-windAngleZone+210));

          //Finally wind speed
          const segmentWindSpeed = average(currentLineSegment.segmentWindSpeed) > minWindSpeed;
          console.log(segmentWindSpeed)
          if(segmentLongEnough && segmentWindDirCorrect && segmentWindSpeed)
          {
            currentLineSegment.linecolor = '#' +  Math.floor(Math.random()*16777215).toString(16);
            segments.push(currentLineSegment)
          }
          else
          {
            currentLineSegment.linecolor = 'grey'
          }
           
        }
        

        positions.push({id: positions.length,  latlon: [[gpxPoints[i].lat,gpxPoints[i].lon]],kmStart: gpxPoints[i].distance_start, kmEnd: 0,segmentWindAngle: [windRouteRelativeDirection],segmentWindSpeed: [gpxPoints[i].wind_speed_gust]})
      }
      else
      {
        currentLineSegment.latlon.push([gpxPoints[i].lat,gpxPoints[i].lon]);
        currentLineSegment.segmentWindSpeed.push(gpxPoints[i].wind_speed_gust)
        currentLineSegment.segmentWindAngle.push(windRouteRelativeDirection);
      }
    }

  } 


  //Set the segments of intrest
  setSegments(segments)
  setPositions(positions);
  

}

export default fetchWeatherData;