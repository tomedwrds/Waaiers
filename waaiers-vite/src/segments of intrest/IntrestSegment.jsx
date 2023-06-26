import { MapContainer,TileLayer,Polyline } from 'react-leaflet';
import average from "../generalpurposefunctions/average";
import './IntrestSegment.css';
import IntrestSegmentStars from './IntrestSegmentStars';




const IntrestSegment = (props) =>
{
    const segmentData = props.data
    const avgWindSpeed = average(segmentData.segmentWindSpeed)
    const avgWindGust = average(segmentData.segmentWindGust)
    const avgWindDir = average(segmentData.segmentWindAngle)
    const kmStart = ((segmentData.kmStart)/1000).toFixed(1)
    const kmEnd = ((segmentData.kmEnd)/1000).toFixed(1)
    const segmentDifficulty = segmentData.segmentDifficulty;
    const lineLatLonData = segmentData.latlon.map((item)=>[item[0],item[1]])
    const windDir = segmentData.classification== undefined ? 'No wind' : segmentData.classification.charAt(0).toUpperCase() + segmentData.classification.slice(1) + 'wind'

    return(
     
      <div className = "intrestSegment">
        <div className='intrestSegment-header'>
          <div className='intrestSegment-lengthstar'>
            <p>{kmStart}km - {kmEnd}km </p>
           
            <IntrestSegmentStars difficulty = {segmentDifficulty}/>
          </div>
         
         
        
          <p className ="intrestSegment-header-windspeed">Wind Speed: {Math.round(avgWindSpeed)}kmph | Wind Gusts: {Math.round(avgWindGust)}kmph</p>
          <p className ="intrestSegment-header-windir" >Wind Direction: {windDir}</p>
        </div>
        
          <div id="map" >
          <MapContainer  style={{width:'100%',height:'100%'}} doubleClickZoom = {false}  zoomControl = {true} center={lineLatLonData[Math.round(lineLatLonData.length/2)]} zoom={12} scrollWheelZoom={false} dragging = {false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
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