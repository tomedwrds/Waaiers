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
        <div className="race-tab">
            
            <p className = "race-name">{routeData.route_name}</p>
            <p className="race-date">{routeData.route_date[2]}/{routeData.route_date[1]}</p>
          

            <button onClick={()=>loadRoutePointData()}>Wind Map</button>

        </div>
    )
}
export default UpcomingRacesTab


