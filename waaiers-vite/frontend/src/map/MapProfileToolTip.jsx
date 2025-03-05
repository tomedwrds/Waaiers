import IntrestSegmentStars from "../segments of intrest/IntrestSegmentStars";
import './MapProfileToolTip.css'
const MapProfileToolTip = ({data}) =>{
    //Etierh display the wind direction or say no segment formed
    const windDir = data.classification == undefined ? 'No wind' : data.classification.charAt(0).toUpperCase() + data.classification.slice(1) + 'wind'


    return(
    <div>
        <h4 className="tootltipTitle">{(data.distanceStart/1000).toFixed(1)}km - {(data.distanceEnd/1000).toFixed(1)}km</h4>
        <p className="tooltipWind">{windDir}</p>
        <div className = "tooltipStars">
            <IntrestSegmentStars  difficulty ={data.difficulty}/>  
        </div>
    </div>
    )
}

export default MapProfileToolTip