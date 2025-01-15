

const fetchWeatherData = async (weatherAPIData,routeTime,routeDate)=>
{

  //The data has to be first parsed from its format in the database to the format for the api call
  const weatherAPIDataParsed =weatherAPIData.map((item)=>{return{lat:item.weather_lat,lon:item.weather_lon}})
  
  //Returns the hour of the route to use an index for the array
  const routeHour = Number(routeTime.split(':')[0])

  //Data to retunr is an array of all weather points
  let returnedData = []

  //For each lat/lon point make an api call
  //The promise all and ensures that for every eleemnt the api returns before continuing
  await Promise.all( weatherAPIDataParsed.map(async weatherPoint => {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+weatherPoint.lat+"&longitude="+weatherPoint.lon+"&hourly=windspeed_10m,winddirection_10m,windgusts_10m&forecast_days=1&start_date="+routeDate+"&end_date="+routeDate+"&timezone=auto")
    let jsonData = await response.json();
   
    //Store the weather api data in a usable format
    let weatherApiData = {
      weather_windspeed: jsonData.hourly.windspeed_10m[routeHour],
      weather_winddir: jsonData.hourly.winddirection_10m[routeHour],
      weather_windgust: jsonData.hourly.windgusts_10m[routeHour]}
    //Add the weather data to the list
    returnedData.push(weatherApiData)   
   } ))

  return returnedData;  

}

export default fetchWeatherData;