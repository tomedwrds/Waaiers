import { useEffect, useState } from "react";
import supabase from "./supabase/supabase";
import UpcomingRacesTab from "./UpcomingRacesTab";


const UpcomingRaces = () =>
{
     // On page load the data is retrieved from the data base and stored in a state hook
    const [allRouteData,setAllRouteData] = useState([]);

    useEffect(()=>{
        async function loadRouteData()
        {
            const {data} = await supabase.from('Routes').select('*');
            setAllRouteData(data);
        }
        loadRouteData();
    },[])

    

    
    //All the routes are then mapped to a component
    return(
        allRouteData.map((item,id)=>{
            return(
                <UpcomingRacesTab key = {id} routeData={item} />
            )
        })
    )
}

export default UpcomingRaces;