import supabase from "./supabase/supabase";
import { useNavigate } from "react-router-dom";
import './upcomingRaces.css'
const UpcomingRacesTab = (props)=>
{
    const navigate = useNavigate();
    const routeData = props.routeData;

    
    async function getRoutePointData(i)
    {
        //Queries and returns 1000 data points
        //The get points weatehr is a custom made postgresql function it exists on supabase
        //The function is
        /*
        CREATE OR REPLACE FUNCTION get_points_weather(route int8 default 0)
            RETURNS TABLE (
            point_lat float8,
            point_lon float8,
            point_dir float4,
            point_distance_start float4,
            point_distance_end float4,
            weather_winddir float8,
            weather_windspeed float4,
            weather_windgust float4
            )
            AS $$
            BEGIN
            RETURN QUERY 
            SELECT "Points".point_lat, "Points".point_lon, "Points".point_dir, "Points".point_distance_start, "Points".point_distance_end,  "Weather".weather_winddir,"Weather".weather_windspeed, "Weather".weather_windgust
            FROM "Points" INNER JOIN "Weather" on "Weather".id = "Points".weather_id
            WHERE "Points".route_id = route;
            END;
            $$ LANGUAGE plpgsql;
        */

        const startPoint = i*1000;
        const endPoint  = ((i+1)*1000)-1
        const {data} = await supabase.rpc('get_points_weather',{route: routeData.id}).range(startPoint,endPoint)
        return data;
    }
        
    async function loadRoutePointData()
    {
        //Only 1000 data points can be retrieved from the database in a single api call to supabase
        //Therefore the query is repeated until until all data is retreived
        let pointData = []
        do{
            //Function is assync hence await keyword is needed. '...' is used to destructure the array
            pointData.push(...(await (getRoutePointData(Math.floor(pointData.length/1000)))))
        } while(pointData.length % 1000 == 0 && pointData.length != 0)

        //Finally navigate to the page to display it
        navigate('/home', { state: {pointData} });
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


