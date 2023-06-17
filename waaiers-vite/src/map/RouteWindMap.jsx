import { MapContainer,TileLayer } from 'react-leaflet'
import LineSegment from './LineSegment'



const RouteWindMap = (props) => {
    if(props.pointData != null)
    {
        const routeCentre = props.pointData[0].latlon[props.routeData.route_center_point]
        const routeZoom = props.routeData.route_zoom
        console.log(props.routeData)
        return(
            <div id="mainMap">
             
            <MapContainer style={{width:'100%',height:'100%'}} center={routeCentre} zoom={routeZoom} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {props.pointData.map((item)=> <LineSegment key = {item.id} linecolor = {(item.classification == props.windDirection ? 'red': 'grey')} latlon = {item.latlon}/>)}
        </MapContainer>
      
        </div>
        )
    }
}

export default RouteWindMap