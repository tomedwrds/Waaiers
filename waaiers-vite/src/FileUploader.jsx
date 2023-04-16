
import { useEffect, useState } from 'react';
import supabase from './supabase/supabase';


function FileUploader() 
{
    

    const [file, setFile] = useState(null);
    const [gpxData, setGPXData] = useState(null);

    const changeHandler = (e) => {
        const file = e.target.files[0];
        //Reading the file is a sideffect so it should be handled in a useEffect
        //This can be done by updating file which a depdendecy of the useffect
        setFile(file);
    }
  
   
    useEffect(()=> {
        //Checks that file is set as useEffect runs on first render
        if (file) 
        {
            //Read the file
            const fileReader = new FileReader();
            fileReader.readAsText(file);

            //Wait till the read is finished
            fileReader.onload = (e) => {
                const { result } = e.target;
                setGPXData(result)
            }
            
      }

    },[file])

   

    async function addRoute() {
        //Checks wether the user has filled out all aspects of the form
        if(routeData.route_date && routeData.route_name &&  routeData.route_time &&  routeData.route_length &&  routeData.route_location)
        {
            const { error } = await supabase.from('Routes').insert(routeData)
            console.log(error)
        }
        else
        {
            console.log("form not complete")
        }
        
    }

     //An empty route data object is defined that is immutability updated to add all propeties of the route
    //This object is in the format of that required for the insert of route query
    const[routeData,setRouteData] = useState({route_name:null,route_date:null,route_time:null,route_length:null,route_location:null})
    console.log(routeData)

    
    return (
        <div>
        

    
        <div>
            <input type ="text" onChange={(e)=>setRouteData({...routeData, route_name: e.target.value})}  />
            <input type ="date" onChange={(e)=>setRouteData({...routeData, route_date: e.target.value})}/>
            <input type ="time" onChange={(e)=>setRouteData({...routeData, route_time: e.target.value})}/>
            <input type ="number" step="0.01" onChange={(e)=>setRouteData({...routeData, route_length: e.target.value})}/>
            <input type ="text" onChange={(e)=>setRouteData({...routeData, route_location: e.target.value})}/>
            <input
                type="file"
                accept='.gpx'
                onChange={changeHandler}
            />
           <button onClick={()=>addRoute()}>Submit</button>
        </div>
    
    </div>
    
     
  );
}

export default FileUploader;