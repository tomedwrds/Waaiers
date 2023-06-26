import { MapContainer,TileLayer,Marker,Popup } from 'react-leaflet'
import LineSegment from './LineSegment'
import './MapPage.css'
import { useEffect, useState } from 'react'
import Legend from './Legend'


function setLineColor(displayedWindDir,segmentWindDir)
{
    if(displayedWindDir == segmentWindDir || displayedWindDir == 'all')
    {
        if(segmentWindDir == 'cross') return 'yellow'
        if(segmentWindDir == 'tail') return 'red'
        if(segmentWindDir == 'head') return 'blue'
        return '#808080'
    }
    else
    {
        return '#808080'
    }
}



const RouteWindMap = (props) => {
    if(props.pointData != null)
    {
        const routeCentre = props.pointData[0].latlon[props.routeData.route_center_point]
        const routeZoom = props.routeData.route_zoom
    
        const iconStart = L.divIcon({
            html: '<i class="fa-solid fa-circle"></i>',
            iconSize: [16, 16],
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
                <Legend/>
                (
                    <Marker position={props.selectedDataPoint} icon={iconStart}>
                   
                    </Marker>
                )
                    
                    {/* <Marker position={props.pointData[0].latlon[0]} icon={iconStart}/>
                    <Marker position={props.pointData[props.pointData.length-1].latlon[props.pointData[props.pointData.length-1].latlon.length-1]} icon={iconFinish}/> */}
                                
                    {props.pointData.map((item)=> <LineSegment key = {item.id} linecolor = {setLineColor(props.windDirection,item.classification)} latlon = {item.latlon} segmentData = {props.pointData[item.id]}/>)}
        
                    
        </MapContainer>
      
        </div>
        )
    }
}

export default RouteWindMap