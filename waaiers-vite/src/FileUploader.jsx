
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
        const { error } = await supabase.from('Routes').insert({ route_name: 'Denmark' })
        console.log(error)
        
    }

    //An empty route data object is defined that is 
    const[routeData,setRouteData] = useState({route_date:null,route_time:null,route_length:null,route_location:null})
    console.log(routeData)

    
    return (
        <div>
        <button onClick={()=>addRoute()}>asfasf</button>

        <form onSubmit={()=>{addRoute(); return false}}>
        <div>
            <input type ="text" onChange={(e)=>setRouteData({...routeData, route_name: e.target.value})}  />
            <input type ="date" />
            <input type ="time" />
            <input type ="number" step="0.01" />
            <input
                type="file"
                accept='.gpx'
                onChange={changeHandler}
            />
            <input type="submit" value = "Submit"/>
        </div>
    </form>
    </div>
    
     
  );
}

export default FileUploader;