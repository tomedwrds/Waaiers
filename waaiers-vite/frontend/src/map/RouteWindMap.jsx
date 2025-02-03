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
        return 'white'
    }
    else
    {
        return 'white'
    }
}



const RouteWindMap = (props) => {
    
    const routeCentre = [props.segmentData[0].points[0].latitude, props.segmentData[0].points[0].longitude]
    const routeZoom = 10 //props.routeData.route_zoom
    const iconCursor = L.divIcon({
        html: '<i class="fa-solid fa-circle"></i>',
        iconSize: [16, 16],
        className: 'cursorIcon'
    });

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
        
        <div id="mainMap">
            
            
        <MapContainer style={{width:'100%',height:'100%'}} center={[routeCentre[0],routeCentre[1]]} zoom={routeZoom} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Legend/>
            (
                {/* <Marker position={props.selectedDataPoint} icon={iconCursor}/> */}
                
            )
                    
                {/* <Marker position={[props.pointData[0].point_lat,props.pointData[0].point_lon]} icon={iconStart}/> */}
                {/* <Marker position={[props.pointData[props.pointData.length-1].point_lat,props.pointData[props.pointData.length-1].point_lon]} icon={iconFinish}/> */}
                            
                {props.segmentData.map((item, id)=> <LineSegment key = {id} linecolor = {"#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")} segmentData={item}/>)}
    
                
    </MapContainer>
    
    </div>
    )
    
}

export default RouteWindMap