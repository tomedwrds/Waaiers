import { MapContainer,TileLayer,Marker,Popup } from 'react-leaflet'
import LineSegment from './LineSegment'
import './MapPage.css'
import { useEffect, useState } from 'react'
import Legend from './Legend'



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
                    
                <Marker position={[props.segmentData[0].points[0].latitude,props.segmentData[0].points[0].longitude]} icon={iconStart}/> 
                <Marker position={[props.segmentData[props.segmentData.length-1].points[props.segmentData[props.segmentData.length-1].points.length-1].latitude,props.segmentData[props.segmentData.length-1].points[props.segmentData[props.segmentData.length-1].points.length-1].longitude]} icon={iconFinish}/>
                            
                {props.segmentData.map((item, id)=> <LineSegment key = {id} dispalyedWindDir = {props.dispalyedWindDir} segmentData ={item}/>)}
    
                
    </MapContainer>
    
    </div>
    )
    
}

export default RouteWindMap