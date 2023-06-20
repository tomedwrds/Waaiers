import { MapContainer,TileLayer } from 'react-leaflet'
import LineSegment from './LineSegment'
import { useEffect,useState } from 'react'



const RouteWindMap = (props) => {
    if(props.pointData != null)
    {
        const routeCentre = props.pointData[0].latlon[props.routeData.route_center_point]
        const routeZoom = props.routeData.route_zoom
        const [map, setMap] = useState(null);


        useEffect(()=>{
            if(map!= null)
            {
                let hg = L.control.heightgraph();
                hg.addTo(map);
                hg.addData(props.pointData);
                L.geoJson(props.pointData).addTo(map);
            }
        },[map])
       
        return(
            
            <div id="mainMap">
                
             
            <MapContainer whenReady={setMap} style={{width:'100%',height:'100%'}} center={routeCentre} zoom={routeZoom} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {props.pointData.map((item)=> <LineSegment key = {item.id} linecolor = {(item.classification == props.windDirection ? 'red': 'grey')} latlon = {item.latlon} segmentData = {props.pointData[item.id]}/>)}
        </MapContainer>
      
        </div>
        )
    }
}

export default RouteWindMap