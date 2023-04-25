import { MapContainer,TileLayer,Polyline } from 'react-leaflet';
import './IntrestSegment.css';
const IntrestSegment = (props) =>
{
    const segmentData = props.data
    const kmStart = ((segmentData.kmStart)/1000).toFixed(1)
    const kmEnd = ((segmentData.kmEnd)/1000).toFixed(1)

    return(
     
      <div className = "intrestSegment">
        <div className='intrestSegment-header'>
          <p>{kmStart}km - {kmEnd}km | Difficulty: ⭐⭐⭐</p>
        
          <p>Wind Direction: lorem | Wind Speed: Ipsum</p>
        </div>
        
          <div id="map" >
          <MapContainer  style={{width:'100%',height:'100%'}} doubleClickZoom = {false}  zoomControl = {false} center={segmentData.latlon[Math.round(segmentData.latlon.length/2)]} zoom={12} scrollWheelZoom={false} dragging = {false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline
                pathOptions={{ fillColor: segmentData.linecolor, color: segmentData.linecolor }}
                positions={segmentData.latlon}
               />
          
          </MapContainer>
          </div>
      
      </div>
    ) 
}
export default IntrestSegment