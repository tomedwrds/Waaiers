import { useEffect,useState } from "react";
import getUserAccessStatus from "../upload route/getUserData";
import supabase from "../supabase/supabase";
import AdminRaceTab from "./AdminRaceTab";


const AdminPanel = ()=>{
    //GET USER ACCESS STATUS
    //Certain features on this page such as updating weather / refreshing data are locked to admins only
    const[userAdmin,setUserAdmin] = useState(false)
    useEffect(()=>{
        //Determines the user access status and wether there the admin
        getUserAccessStatus(setUserAdmin);
    },[])


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

    if(userAdmin)
    {
        return(
            allRouteData.map((item,index)=>{return(<AdminRaceTab key = {index} data ={item}/>)})
        )
    }
    else
    {
        return(
            <p>Access Denied</p>
        )
        
    }
   
}
export default AdminPanel