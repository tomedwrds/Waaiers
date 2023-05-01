import supabase from "./supabase/supabase";

async function RefreshWeatherData (route_id)
{
    //First fetch the weather data points relavent to the route
    const weatherPoints = await supabase.from('Weather').select('weather_lat,weather_lon').eq('route_id',route_id);
    console.log(weatherPoints)
}
export default RefreshWeatherData