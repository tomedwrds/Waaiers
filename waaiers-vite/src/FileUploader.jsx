
import { useEffect, useState } from 'react';
import supabase from './supabase/supabase';
import GPXIntalizeFile from './gpx/GPXIntalizeFile';


function FileUploader() 
{
    

    const [file, setFile] = useState(null);
    const [routeGpxData, setRouteGPXData] = useState(null);

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
                setRouteGPXData(result)
            }
            
      }

    },[file])

   

    async function addRoute() {
        //Checks wether the user has filled out all aspects of the form
        if(routeData.route_date && routeData.route_name &&  routeData.route_time &&  routeData.route_length &&  routeData.route_location && routeGpxData)
        {
            //Insert the route data into the database
            const routeInsertQuery = await supabase.from('Routes').insert(routeData).select();
             
            //The inserted row is returned and from that we can retrieve the id of the route which can then be used as a common key
            const route_id = routeInsertQuery.data[0].id
           
            //This functions returns an array. Index 0 is all gpx points. Index 1 is all points to check weather on
            const [pointData, weatherData] = GPXIntalizeFile(routeGpxData)
            
            //Next the weather data is inserted we first need to add in the id of the route to function as a forgein key
            weatherData.map((data)=>{data.route_id = route_id})
            
            //Finally insert the route weather data
            const weatherInsertQuery = await supabase.from('Weather').insert(weatherData).select();

            //The data from the query is retruned we want to get the id of the first weather point to use as common key for route points
            const weather_id = weatherInsertQuery.data[0].id

            //Add the offset of the id to all points
            pointData.map((data)=>{data.weather_id += weather_id,data.route_id = route_id})

            //Finally insert the route point data
            const pointInsertQuery = await supabase.from('Points').insert(pointData);


           
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
    
     
  );
}

export default FileUploader;