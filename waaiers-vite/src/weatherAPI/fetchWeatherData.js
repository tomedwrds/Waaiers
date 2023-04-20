import average from "../generalpurposefunctions/average";


const fetchWeatherData = async (gpxPoints,weatherAPIData,routeTime,routeDate)=>
{

  //The data has to be first parsed from its format in the database to the format for the api call
  const weatherAPIDataParsed =weatherAPIData.map((item)=>{return{lat:item.weather_lat,lon:item.weather_lon}})
  
  const raceTime = routeDate+'T'+routeTime+':00Z';

  const url = 'https://forecast-v2.metoceanapi.com/point/time';

  const data = {
    points: weatherAPIDataParsed,
    variables: ['wind.direction.at-10m','wind.speed.at-10m','wind.speed.gust.at-10m'],
    time: {
      from: raceTime,
      interval: '3h',
      repeat: 0,
    }
  };


  let options = {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_metservice_api_key //API is stored in private file so it cant be stolen and malsicsoly used
    }
  };

  let response = await fetch(url, options);
  console.log('API response status:', response);
  
  let json = await response.json();
  console.log('API response status:', json);

  //Retrieve the data from the API call
  const returnedData = json.variables;

  return returnedData;  

}

export default fetchWeatherData;