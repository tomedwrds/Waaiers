import average from "../generalpurposefunctions/average";

function generateMapData(gpxPoints,setPositions,setSegments,segmentParameters)
{
    let positions = [];
 
    const kmInterval = 15;
  
  
    //Segment related constants and data
    let segments = [];

    //The golden angle is the ideal angle for causing cross wind splits
    //An angle of 0 is a tail wind
    const windAngleGolden = segmentParameters.windAngleGolden;
    //Range of angle around the golden angle that would cause splits
    const windAngleZone = segmentParameters.windAngleZone;
    
    const minWindSpeed = segmentParameters.minWindSpeed;
    const maxWindSpeed = segmentParameters.maxWindSpeed;

    const minSegmentLength = segmentParameters.minSegmentLength;
    const maxSegmentLength = segmentParameters.maxSegmentLength;
  
  
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
        positions.push({id: 0, latlon: [[gpxPoints[i].point_lat,gpxPoints[i].point_lon]],kmStart: 0, kmEnd: 0,segmentWindAngle: [windRouteRelativeDirection],segmentWindSpeed: [gpxPoints[i].weather_windspeed],segmentWindGust: [gpxPoints[i].weather_windgust]})
  
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
            currentLineSegment.segmentWindGust.push(gpxPoints[i].weather_windgust)
            currentLineSegment.kmEnd = gpxPoints[i].point_distance_end;
  
            //Each segment is evalutated to check if it meets minimun criteria to be a segment of intrest if not just rendered as a generic gray segment
            
            //First length is evalutated
            const segmentLength = currentLineSegment.kmEnd - currentLineSegment.kmStart;
            const segmentLongEnough = segmentLength  > minSegmentLength;
  
            //Next wind direction
            const segmentWindDir = (average(currentLineSegment.segmentWindAngle) + 360) % 360 
            const segmentWindDCross = (segmentWindDir < (windAngleGolden+windAngleZone) && segmentWindDir > (windAngleGolden-windAngleZone)) || (segmentWindDir < (windAngleGolden+windAngleZone+210) && segmentWindDir > (windAngleGolden-windAngleZone+210));
            const segmentWindHead = (segmentWindDir >= windAngleGolden+windAngleZone && segmentWindDir <= (windAngleGolden-windAngleZone+210));
            const segmentWindTail =  (segmentWindDir <= (windAngleGolden-windAngleZone) || segmentWindDir >= (windAngleGolden+windAngleZone+210))
            
            //Finally wind speed
            const segmentWindSpeed = average(currentLineSegment.segmentWindSpeed) > minWindSpeed;
           
            //Determine if the wind dir is correct
            const segmentWindDirCorrect = segmentWindDCross || segmentWindHead || segmentWindTail;

            if(segmentLongEnough && segmentWindDirCorrect && segmentWindSpeed)
            {
             

              //Generate difficulty of segment
              let segmentDifficulty = 0;

              //1 point is avalaible for each of length, wind speed and wind direction, it is taken based on how well it does in comparison to mind and max values
              segmentDifficulty += Math.min((currentLineSegment.kmEnd-currentLineSegment.kmStart)/maxSegmentLength,1)
              segmentDifficulty += Math.min((average(currentLineSegment.segmentWindSpeed))/maxWindSpeed,1)

              //Finding how far of the wind angle is a bit harder this is depedent on the direction
              //We first find distance betwee avg angle of segment and ideal angle. Then we divide by size of zone to determine how much it fills then -1. Repeated for other side in the case of cross wind
              if(segmentWindDCross)
              {
                segmentDifficulty += Math.max( 1-Math.abs(average(currentLineSegment.segmentWindAngle)-windAngleGolden)/windAngleZone,1-Math.abs(average(currentLineSegment.segmentWindAngle)-(windAngleGolden+210))/windAngleZone)
                
                //Also set color and classification
                currentLineSegment.classification = 'cross';
              }
              else if(segmentWindHead)
              {
                //Some variables are hardcoded here and should be changed in the future
                segmentDifficulty +=  1-Math.abs(average(currentLineSegment.segmentWindAngle)-180)/75
                
                //Also set color and classification
                currentLineSegment.classification = 'head';
              }
              else if(segmentWindTail)
              {
                //Some variables are hardcoded here and should be changed in the future
                segmentDifficulty +=  Math.max( 1-Math.abs(average(currentLineSegment.segmentWindAngle))/45,1-Math.abs(average(currentLineSegment.segmentWindAngle)-360)/45)
                
                //Also set color and classification
                currentLineSegment.classification = 'tail';
              }
              


              segments.push({...currentLineSegment,segmentDifficulty:segmentDifficulty});
            }
           
             
          }
          
  
          positions.push({id: positions.length,  latlon: [[gpxPoints[i].point_lat,gpxPoints[i].point_lon]],kmStart: gpxPoints[i].point_distance_start, kmEnd: 0,segmentWindAngle: [windRouteRelativeDirection],segmentWindSpeed: [gpxPoints[i].weather_windspeed],segmentWindGust: [gpxPoints[i].weather_windgust]})
        }
        else
        {
          currentLineSegment.latlon.push([gpxPoints[i].point_lat,gpxPoints[i].point_lon]);
          currentLineSegment.segmentWindSpeed.push(gpxPoints[i].weather_windspeed)
          currentLineSegment.segmentWindAngle.push(windRouteRelativeDirection);
          currentLineSegment.segmentWindGust.push(gpxPoints[i].weather_windgust)
        }
      }
    }
    //Update the state hooks
    setPositions(positions);
    setSegments(segments)
}

export default generateMapData