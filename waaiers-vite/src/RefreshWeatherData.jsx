import supabase from "./supabase/supabase";
import fetchWeatherData from "./weatherAPI/fetchWeatherData";

async function RefreshWeatherData (route_data)
{
    const route_id = route_data.id;
    const route_date = route_data.route_date;
    const route_time = route_data.route_time.substr(0,route_data.route_time.length-3);

    //First fetch the weather data points relavent to the route
    const weatherPoints = await supabase.from('Weather').select('weather_lat,weather_lon').eq('route_id',route_id);
    
    //Then requery the weather api
    const updatedWeatherData = await fetchWeatherData(null,weatherPoints.data,route_time,route_date)
    console.log(updatedWeatherData)
}
export default RefreshWeatherData