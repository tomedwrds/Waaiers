import supabase from "./supabase/supabase";
import { useNavigate } from "react-router-dom";
import './upcomingRaces.css'
const UpcomingRacesTab = (props)=>
{
    const navigate = useNavigate();
    const routeData = props.routeData;
   
    async function loadRoutePointData()
    {
        //Finally navigate to the page to display it
        navigate('/race/'+routeData.id );
    }

    
    return(
        <div className={"race-tab"+props.styleSuffix}>
            <div className={"race-tab-left"+props.styleSuffix}>
                <p className = {"race-name"+props.styleSuffix}>{routeData.route_name}</p>
                <p className={"race-date"+props.styleSuffix}>{routeData.route_date[2]}/{routeData.route_date[1]}</p>
            </div>
            <div>
                <button onClick={()=>loadRoutePointData()}>{props.styleSuffix == "-home" ? <i class="fa-solid fa-map"></i> : <p>Wind Map</p> }</button>
            </div>
        </div>
    )
}
export default UpcomingRacesTab


