import { Polyline,Popup } from "react-leaflet";


const LineSegment = (props)=>
{
    return(
        <div>
        <Polyline
        pathOptions={{ fillColor: 'red', color: props.linecolor }}
        positions={props.latlon}
        eventHandlers={{
            mouseover: ()=>(console.log("fff"))
        }}
        />
        
        </div>
        
    )
  

}

export default LineSegment;