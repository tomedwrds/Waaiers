import { useState } from "react";
import { Marker, Polyline,Popup } from "react-leaflet";
import SegmentInfo from "./SegmentInfo";



const LineSegment = (props)=>
{
  
    const lineLatLonData = props.latlon.map((item)=>[item[0],item[1]])
    return(
        <div>
        <Polyline
        
        pathOptions={{ fillColor: 'red', color: props.linecolor }}
        positions={lineLatLonData}
        children={<Popup style = {{backgroundColor:'blue'}} ><SegmentInfo segmentData={props.segmentData}/></Popup>}   
        weight={4}   
        eventHandlers={{
          click: (e) => {
            if(props.segmentData.hasOwnProperty('segmentDifficulty')) e.target.openPopup()
        },
       
        }}
        
        />
       
        
    
        
        </div>
        
    )
  

}

export default LineSegment;