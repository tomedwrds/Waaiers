import { useState } from "react";
import { Marker, Polyline,Popup } from "react-leaflet";
import SegmentInfo from "./SegmentInfo";



const LineSegment = (props)=>
{
  
    const lineLatLonData = props.latlon.map((item)=>[item[0],item[1]])
    const [displayPopup,setDisplayPopup] = useState(false)
    return(
        <div>
        <Polyline
        
        pathOptions={{ fillColor: 'red', color: props.linecolor }}
        positions={lineLatLonData}
        children={(displayPopup? <Popup style = {{backgroundColor:'blue'}} ><SegmentInfo segmentData={props.segmentData}/></Popup>:[])}   
        weight={4}   
        eventHandlers={{
          click: () => {
            if(props.linecolor != 'grey')
             { setDisplayPopup(true)}
        },
       
        }}
        
        />
       
        
    
        
        </div>
        
    )
  

}

export default LineSegment;