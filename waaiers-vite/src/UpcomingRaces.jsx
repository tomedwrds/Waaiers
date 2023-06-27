import { useEffect, useState } from "react";
import supabase from "./supabase/supabase";
import UpcomingRacesTab from "./UpcomingRacesTab";
import './upcomingRaces.css'

const UpcomingRaces = () =>
{
     // On page load the data is retrieved from the data base and stored in a state hook
    const [allRouteData,setAllRouteData] = useState([]);

    useEffect(()=>{
        async function loadRouteData()
        {
            const {data} = await supabase.from('Routes').select('*');


            //I want the list of upcoming races to be sorted by date so I will split the date format into an array or year / month / day
            {data.map((item,id)=>{
                item.route_date = item.route_date.split('-')
        
            })}

            data.sort(function (a, b) {   
                return Number(a.route_date[1]) - Number(b.route_date[1]) || Number(a.route_date[2]) - Number(b.route_date[2]);
            });
           
            setAllRouteData(data);
        }
        loadRouteData();
    },[])

    

    
    //All the routes are then mapped to a component
    return(
        <div style={{flex:'1'}}>

            <h1>Upcoming Races</h1>
            
            {allRouteData.map((item,id)=>{
                if(item.route_visible)
                {
                    return(
                        <UpcomingRacesTab key = {id} routeData={item} />
                    )
                }
                
            })}
        </div>
    )
}

export default UpcomingRaces;