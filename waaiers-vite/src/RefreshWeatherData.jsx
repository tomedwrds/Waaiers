import supabase from "./supabase/supabase";
import fetchWeatherData from "./weatherAPI/fetchWeatherData";

async function RefreshWeatherData (route_data)
{
    const route_id = route_data.id;
    const route_date = route_data.route_date;
    const route_time = route_data.route_time.substr(0,route_data.route_time.length-3);

    //First fetch the weather data points relavent to the route
    const weatherPoints = await supabase.from('Weather').select('weather_lat,weather_lon,id').eq('route_id',route_id);
    
    //Then requery the weather api
    const updatedWeatherData = await fetchWeatherData(null,weatherPoints.data,route_time,route_date)


    
    
    //Finally reformat the data to be updated on the databse
    const windDirection = updatedWeatherData['wind.direction.at-10m'].data;
    const windSpeed = updatedWeatherData['wind.speed.at-10m'].data;
    const windSpeedGust = updatedWeatherData['wind.speed.gust.at-10m'].data;

    const formattedUpdatedWeatherData = weatherPoints.data.map((item,index)=>({...item, weather_windspeed: windSpeed[index],weather_windgust: windSpeedGust[index], weather_winddir: windDirection[index]}))

    //Update the database
    
    formattedUpdatedWeatherData.forEach((item)=> (updateWeatherDataQuery(item)));

}

async function updateWeatherDataQuery(item)
{
    const queryReturn = await supabase.from('Weather').update({weather_windspeed:item.weather_windspeed,weather_winddir: item.weather_winddir, weather_windgust: item.weather_windgust}).eq('id',item.id);
    console.log(queryReturn)
}
export default RefreshWeatherData