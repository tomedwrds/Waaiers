import { useState } from "react";
import { Marker, Polyline,Popup } from "react-leaflet";


const SegmentInfo = (props) =>
{
    // if(props.display)
    // {
    //     return(
    //         <Marker  opacity={0.5} position={props.position}>
    //             <Popup>
    //                 A pretty CSS3 popup. <br /> Easily customizable.
    //             </Popup>
    //         </Marker>
    //     )
    // }
}

const LineSegment = (props)=>
{
    const [popUp,displayPopUp] = useState(false);
    return(
        <div>
        <Polyline
        pathOptions={{ fillColor: 'red', color: props.linecolor }}
        positions={props.latlon}
        eventHandlers={{
            mouseover: ()=>(console.log(props)),
            moveend: ()=>(displayPopUp(false)),
            
        }}
        
        
        />
        <SegmentInfo display = {popUp} position = {props.latlon[0]}/>
        
    
        
        </div>
        
    )
  

}

export default LineSegment;