import { useState } from "react";
import { Marker, Polyline,Popup } from "react-leaflet";
import SegmentInfo from "./SegmentInfo";

function setLineColor(displayedWindDir,segmentWindDir)
{
    if(displayedWindDir == segmentWindDir || displayedWindDir == 'all')
    {
        if(segmentWindDir == 'cross') return 'yellow'
        if(segmentWindDir == 'tail') return 'red'
        if(segmentWindDir == 'head') return 'blue'
    }
    return 'white'
}

const LineSegment = (props)=>
{

    const lineLatLonData = props.segmentData.points.map((item)=>[item.latitude ,item.longitude])
    const [displayPopup,setDisplayPopup] = useState(false)
    const lineColor = setLineColor(props.dispalyedWindDir, props.segmentData.classification)
    return(
        <div>
        <Polyline
        
        pathOptions={{ fillColor: 'red', color: lineColor }}
        positions={lineLatLonData}
        children={(displayPopup? <Popup style = {{backgroundColor:'blue'}} ><SegmentInfo segmentData={props.segmentData}/></Popup>:[])}   
        weight={4}   
        eventHandlers={{
          click: () => {
            if(lineColor != 'white')
             { setDisplayPopup(true)}
        },
       
        }}
        
        />
       
        
    
        
        </div>
        
    )
  

}

export default LineSegment;