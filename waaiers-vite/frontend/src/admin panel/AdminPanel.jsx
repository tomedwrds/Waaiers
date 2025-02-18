import { useEffect,useState } from "react";
import getUserAccessStatus from "../upload route/getUserData";
import supabase from "../supabase/supabase";
import AdminRaceTab from "./AdminRaceTab";


const AdminPanel = ()=>{
     // On page load the data is retrieved from the data base and stored in a state hook
     const [allRouteData,setAllRouteData] = useState([]);

     useEffect(()=>{
         async function loadRouteData()
         {
             try {
                const response = await fetch("https://localhost:7276/api/Route");
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

    
    return(
        allRouteData.map((item,index)=>{return(<AdminRaceTab key = {index} data ={item}/>)})
    )
    
   
}
export default AdminPanel