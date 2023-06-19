import { useState } from "react";
import { Marker, Polyline,Popup } from "react-leaflet";
import SegmentInfo from "./SegmentInfo";



const LineSegment = (props)=>
{
    return(
        <div>
        <Polyline
        
        pathOptions={{ fillColor: 'red', color: props.linecolor }}
        positions={props.latlon}
        children={<Popup style = {{backgroundColor:'blue'}} ><SegmentInfo segmentData={props.segmentData}/></Popup>}   
        weight={4}   
        eventHandlers={{
          click: (e) => {
            if(props.segmentData.segmentDifficulty != undefined) e.target.openPopup()
        },
       
        }}
        
        />
       
        
    
        
        </div>
        
    )
  

}

export default LineSegment;