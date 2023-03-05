import { MapContainer,TileLayer } from 'react-leaflet'
import LineSegment from './LineSegment'



const RouteWindMap = (props) => {
    if(props.data != null)
    {
        return(
            <MapContainer center={props.data[0].latlon[0]} zoom={10} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {props.data.map((item)=> <LineSegment key = {item.id} linecolor = {item.linecolor} latlon = {item.latlon}/>)}
        </MapContainer>
        )
    }
}

export default RouteWindMap