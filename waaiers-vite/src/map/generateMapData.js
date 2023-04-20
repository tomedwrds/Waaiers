import average from "../generalpurposefunctions/average";

function generateMapData(gpxPoints,setPositions,setSegments)
{
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
  
  
  
    //Calculate the wind data for all gpxPoints
    for(let i = 0; i < gpxPoints.length-1; i++)
    {
      //Get the relative wind direction ie the direcion of the wind from behind the rider 0deg tail wind 180deg headwind
      //Wind direction is viewed as the direction the wind came from therefore it needs to be shifted by 180 to get a value of direction wind  came from
      const invertedWindDirection = (gpxPoints[i].weather_winddir + 180) % 360;
      let windRouteRelativeDirection = gpxPoints[i].point_dir - invertedWindDirection;
    
      //Modulos doesnt work for negative numbers so 360 must be added if less than 0
     if(windRouteRelativeDirection < 0) windRouteRelativeDirection += 360;
      gpxPoints[i].wind_route_realtive = windRouteRelativeDirection;
  
  
      //On the map polylines are rendered to display the route
      //This allows diffrent styling to be applied to the broken up polyline segment
      //Interactive data can also be added ie popups.
      
      if(positions.length == 0)
      {
        //In case of first segment an inital item must be added
        positions.push({id: 0, latlon: [[gpxPoints[i].point_lat,gpxPoints[i].point_lon]],kmStart: 0, kmEnd: 0,segmentWindAngle: [windRouteRelativeDirection],segmentWindSpeed: [gpxPoints[i].weather_windspeed]})
  
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
          if(currentLineSegment.latlon.length == 1 && currentLineSegment.latlon[0] != [gpxPoints[i].point_lat,gpxPoints[i].point_lon])
          {
           positions.pop();      
          }
          else
          {
  
            //Prior to adding a new polyline in a final point is added to the prior polyline to join them togehter
            currentLineSegment.latlon.push([gpxPoints[i].point_lat,gpxPoints[i].point_lon]);
            currentLineSegment.segmentWindSpeed.push(gpxPoints[i].weather_windspeed)
            currentLineSegment.kmEnd = gpxPoints[i].point_distance_end;
  
            //Each segment is evalutated to check if it meets minimun criteria to be a segment of intrest
            
            //First length is evalutated
            const segmentLength = currentLineSegment.kmEnd - currentLineSegment.kmStart;
            const segmentLongEnough = segmentLength  > minSegmentLength;
  
            //Next wind direction
            const segmentWindDir = (average(currentLineSegment.segmentWindAngle) + 360) % 360 
            const segmentWindDirCorrect = (segmentWindDir < (windAngleGolden+windAngleZone) && segmentWindDir > (windAngleGolden-windAngleZone)) || (segmentWindDir < (windAngleGolden+windAngleZone+210) && segmentWindDir > (windAngleGolden-windAngleZone+210));
  
            //Finally wind speed
            const segmentWindSpeed = average(currentLineSegment.segmentWindSpeed) > minWindSpeed;
           
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
          
  
          positions.push({id: positions.length,  latlon: [[gpxPoints[i].point_lat,gpxPoints[i].point_lon]],kmStart: gpxPoints[i].point_distance_start, kmEnd: 0,segmentWindAngle: [windRouteRelativeDirection],segmentWindSpeed: [gpxPoints[i].weather_windspeed]})
        }
        else
        {
          currentLineSegment.latlon.push([gpxPoints[i].point_lat,gpxPoints[i].point_lon]);
          currentLineSegment.segmentWindSpeed.push(gpxPoints[i].weather_windspeed)
          currentLineSegment.segmentWindAngle.push(windRouteRelativeDirection);
        }
      }
    }
    //Update the state hooks
    setPositions(positions);
    setSegments(segments)
}

export default generateMapData