import IntrestSegmentStars from "../segments of intrest/IntrestSegmentStars";
import './MapProfileToolTip.css'
const MapProfileToolTip = (props) =>{
    //Etierh display the wind direction or say no segment formed
    const windDir = props.winddir== undefined ? 'No wind' : props.winddir.charAt(0).toUpperCase() + props.winddir.slice(1) + 'wind'


    return(
    <div>
        <h4 className="tootltipTitle">{props.name}</h4>
        <p className="tooltipWind">{windDir}</p>
        <div className = "tooltipStars">
            <IntrestSegmentStars  difficulty ={props.difficulty}/>  
        </div>
    </div>
    )
}

export default MapProfileToolTip