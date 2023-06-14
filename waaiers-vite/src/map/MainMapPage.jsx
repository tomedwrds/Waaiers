import { useEffect, useState } from 'react';
import RouteWindMap from './RouteWindMap';
import IntrestSegmentContainer from '../segments of intrest/IntrestSegmentContainer';
import { useLocation } from 'react-router-dom';
import generateMapData from './generateMapData';
import getUserAccessStatus from '../upload route/getUserData';
import supabase from '../supabase/supabase';




const MainMapPage = () => {
    
   

    //Create the postion and segments state hook
    const [positions,setPositions] = useState(null);
    const [segments,setSegments] = useState(null);
    const [routeData, setRouteData] = useState(null);

    async function getRoutePointData(i,routeData)
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

    async function fetchRouteData(route_id)
    {
        //Query supabase to get route data and store it
        const {data} = await supabase.from('Routes').select('*').eq('id',route_id);
        const route_data = data[0];
        
        
        //Next we must get the point data for that route due to api restrictions
        //Only 1000 data points can be retrieved from the database in a single api call to supabase
        //Therefore the query is repeated until until all data is retreived
        let pointData = []
        do{
            //Function is assync hence await keyword is needed. '...' is used to destructure the array
            pointData.push(...(await (getRoutePointData(Math.floor(pointData.length/1000),route_data))))
        } while(pointData.length % 1000 == 0 && pointData.length != 0)

        return({point_data: pointData,route_data: route_data})
      
    }

    async function generateMap()
    {
        //Get the route id from the url
        const route_id = window.location.pathname.split('/')[2];
        const database_data = await fetchRouteData(route_id);
        console.log(database_data)
        const point_data = database_data.point_data
        const route_data = database_data.route_data
        console.log(route_data)
        //Fetches the weather data on page load
        generateMapData(point_data,setPositions,setSegments);

        //Also gets the route data
        setRouteData(route_data);
    }

    useEffect(() => {
        generateMap()
    }, [])

    //Dont attempt to render anything until the route data has loaded
    if(routeData != null)
    {
        return(
        <div className = "body">  
            <h1 style = {{borderTop: '2px solid black',borderBottom: '2px solid black',paddingTop: '10px',paddingBottom: '10px'}}>{routeData.route_name}</h1>
            <RouteWindMap pointData = {positions} routeData = {routeData} />
            <h1 style = {{borderTop: '2px solid black',borderBottom: '2px solid black',paddingTop: '10px',paddingBottom: '10px'}}>Segments of Intrest</h1>
            <IntrestSegmentContainer data = {segments}/>
        </div>
        )
    }
}

export default MainMapPage