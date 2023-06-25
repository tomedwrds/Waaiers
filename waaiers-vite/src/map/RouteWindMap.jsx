import { MapContainer,TileLayer,Marker,Popup } from 'react-leaflet'
import LineSegment from './LineSegment'
import './MapPage.css'




const RouteWindMap = (props) => {
    if(props.pointData != null)
    {
        const routeCentre = props.pointData[0].latlon[props.routeData.route_center_point]
        const routeZoom = props.routeData.route_zoom
    
        const iconStart = L.divIcon({
            html: ' <i class="fa-solid fa-play"></i>',
            iconSize: [20, 20],
            className: 'startIcon'
        });

        const iconFinish = L.divIcon({
            html: ' <i class="fa-solid fa-flag-checkered"></i>',
            iconSize: [20, 20],
            className: 'finishIcon'
        });
       

        return(
            
            <div id="mainMap">
                
             
            <MapContainer style={{width:'100%',height:'100%'}} center={[routeCentre[0],routeCentre[1]]} zoom={routeZoom} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                (
                    <Marker position={props.selectedDataPoint}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                    </Marker>
                )
                    
                    {/* <Marker position={props.pointData[0].latlon[0]} icon={iconStart}/>
                    <Marker position={props.pointData[props.pointData.length-1].latlon[props.pointData[props.pointData.length-1].latlon.length-1]} icon={iconFinish}/> */}
                                
                    {props.pointData.map((item)=> <LineSegment key = {item.id} linecolor = {(item.classification == props.windDirection ? 'red': 'grey')} latlon = {item.latlon} segmentData = {props.pointData[item.id]}/>)}
        </MapContainer>
      
        </div>
        )
    }
}

export default RouteWindMap