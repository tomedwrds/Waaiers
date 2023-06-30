import { MapContainer,TileLayer,Polyline,Marker } from 'react-leaflet';
import average from "../generalpurposefunctions/average";
import './IntrestSegment.css';
import IntrestSegmentStars from './IntrestSegmentStars';
import arrow from './arrow.png'



const IntrestSegment = (props) =>
{
    const segmentData = props.data
    const avgWindSpeed = average(segmentData.segmentWindSpeed)
    const avgWindGust = average(segmentData.segmentWindGust)
    const avgWindDir = average(segmentData.segmentWindAngle)
    const avgWindDirNonRelative = average(segmentData.segmentWindAngleNonRelative)
    const kmStart = ((segmentData.kmStart)/1000).toFixed(1)
    const kmEnd = ((segmentData.kmEnd)/1000).toFixed(1)
    const segmentDifficulty = segmentData.segmentDifficulty;
    const lineLatLonData = segmentData.latlon.map((item)=>[item[0],item[1]])
    const windDir = segmentData.classification== undefined ? 'No wind' : segmentData.classification.charAt(0).toUpperCase() + segmentData.classification.slice(1) + 'wind'



    const iconStart = L.divIcon({
      html: '<i class="fa-solid fa-play"></i>',
      iconSize: [16, 16],
      className: 'startIcon'
    });

    const iconFinish = L.divIcon({
        html: ' <i class="fa-solid fa-flag-checkered"></i>',
        iconSize: [20, 20],
        className: 'finishIcon'
    });
    return(
     
      <div className = "intrestSegment">
        <div className='intrestSegment-header'>
          <div className='intrestSegment-lengthstar'>
            <p>{kmStart}km - {kmEnd}km </p>
           
            <IntrestSegmentStars difficulty = {segmentDifficulty}/>
          </div>
         
         
        
          <p className ="intrestSegment-header-windspeed">Wind Speed: {Math.round(avgWindSpeed)}kmph | Wind Gusts: {Math.round(avgWindGust)}kmph</p>
          
        </div>
        
          <div id="map" >
          <MapContainer className='intrestSegmentMap' doubleClickZoom = {false}  zoomControl = {true} center={lineLatLonData[Math.round(lineLatLonData.length/2)]} zoom={12} scrollWheelZoom={false} dragging = {false}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={lineLatLonData[0]} icon={iconStart}/>
              <Marker position={lineLatLonData[lineLatLonData.length-1]} icon={iconFinish}/>
             
    
                <div className='intrestSegmentMapLegend'>
                <p className ="intrestSegment-header-windir" ><strong>{windDir}</strong></p>
                  <img src ={arrow} style={{ transform: `rotate(${avgWindDirNonRelative+90}deg)`}}/>
                  <p>Wind</p>
                  <p>Direction</p>
                </div>
            
              <Polyline
                pathOptions={{ fillColor: 'red', color: 'black' }}
                positions={lineLatLonData}
               />
          
          </MapContainer>
          </div>
         
      
      </div>
    ) 
}
export default IntrestSegment