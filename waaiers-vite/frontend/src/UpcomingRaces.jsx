import { useEffect, useState } from "react";
import supabase from "./supabase/supabase";
import UpcomingRacesTab from "./UpcomingRacesTab";
import './upcomingRaces.css'

const UpcomingRaces = () =>
{
    const [allRouteData,setAllRouteData] = useState([]);

    useEffect(()=>{
        async function loadRouteData()
        {
            try {
                const response = await fetch(import.meta.env.VITE_BASE_API_STRING + "/Route", {credentials:"include"});
                if (!response.ok) {
                  throw new Error(`Response status: ${response.status}`);
                }
                const data = await response.json()
                data.sort(function (a, b) {   
                    return new Date(a.date) - new Date(b.date);
                });
                setAllRouteData(data);

            } catch (error) {
                console.error(error.message);
            }
           
            
        }
        loadRouteData();
    },[])

    //Check if user on home page if so needs to be styled diffrently. This can be done by adding a prefix to the classname for the diffrently styled ones
    let styleSuffix=""
    if(window.location.pathname == '/') //home
    {
        styleSuffix="-home"
    }
    

    //All the routes are then mapped to a component
    return(
        <div style={{flex:'1'}}>

            <h1>Upcoming Races</h1>
            
            {allRouteData.map((item)=>{
                if(item.displayed)
                {
                    return(
                        <UpcomingRacesTab key = {item.id} routeData={item} styleSuffix = {styleSuffix} />
                    )
                }
                
            })}
        </div>
    )
}

export default UpcomingRaces;