import supabase from "../supabase/supabase";
import GPXIntalizeFile from '../gpx/GPXIntalizeFile';
import fetchWeatherData from '../weatherAPI/fetchWeatherData';


async function addRoute(routeData,routeGpxData,userAdmin,navigate) {

    
    //Checks wether the user has filled out all aspects of the form
    if(routeData.route_date && routeData.route_name &&  routeData.route_time  && routeGpxData)
    {
        //This functions returns an array. Index 0 is all gpx points. Index 1 is all points to check weather on
        const [pointData, weatherData] = GPXIntalizeFile(routeGpxData)
        

        //The wind direction / speech gets fetched from the api
        const apiWeatherData = await fetchWeatherData(pointData,weatherData,routeData.route_time,routeData.route_date);
        
        const windDirection = apiWeatherData['wind.direction.at-10m'].data;
        const windSpeed = apiWeatherData['wind.speed.at-10m'].data;
        const windSpeedGust = apiWeatherData['wind.speed.gust.at-10m'].data;

        //CASE 1: User is an admin and is uploading the gpx file to be viewed by the public in this case it has to be stored in a database 
        if(userAdmin)
        {
            //Insert the route data into the database
            const routeInsertQuery = await supabase.from('Routes').insert(routeData).select();
            
            //The inserted row is returned and from that we can retrieve the id of the route which can then be used as a common key
            const route_id = routeInsertQuery.data[0].id

            //Next the weather data is inserted we first need to add in the id of the route to function as a forgein key
            weatherData.map((data,id)=>{
                data.route_id = route_id,
                data.weather_windspeed = windSpeed[id],
                data.weather_winddir   = windDirection[id],
                data.weather_windgust = windSpeedGust[id]})
        
            //Finally insert the route weather data
            const weatherInsertQuery = await supabase.from('Weather').insert(weatherData).select();

            //The data from the query is retruned we want to get the id of the first weather point to use as common key for route points
            const weather_id = weatherInsertQuery.data[0].id

            //Add the offset of the id to all points
            pointData.map((data)=>{data.weather_id += weather_id,data.route_id = route_id})
    
            //Finally insert the route point data
            const pointInsertQuery = await supabase.from('Points').insert(pointData);
        }

        //CASE 2: User does not have admin status and is creating the Waaier map for single view purposes
        //In this case the user is routed to main map page, however the data must be formatted for the route generation algorithm in the same way the data will be when quereid from the database
        else
        {
            //The weather data must be added to every point. in the case of the sql query a join would be used instead a map is used here
            pointData.map((item)=>{ item.weather_windspeed = windSpeed[item.weather_id]
                                    item.weather_winddir = windDirection[item.weather_id],
                                    item.weather_windgust = windSpeedGust[item.weather_id]});
           
            //Next we should route to the main map page and send the data
            
            //Also we must send the route specific data
            //These are just default values for displaying the route
            routeData.route_center_point = 0;
            routeData.route_zoom = 10;

            navigate('/home', { state: {pointData,routeData} });

        }
        


       
    }
    else
    {
        alert("Submission error - form not complete")
    }
    
}

export default addRoute