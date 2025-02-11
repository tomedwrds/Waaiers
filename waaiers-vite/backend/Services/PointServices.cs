using backend.Models;
using backend.Interfaces;
using System.Text.Json;
namespace backend.Services {
    public class PointService : IPointService {
        private readonly Supabase.Client _supabaseClient;
        private readonly IHttpClientFactory _httpClientFactory;

        public PointService(Supabase.Client supabaseClient, IHttpClientFactory httpClientFactory)
        {
            _supabaseClient = supabaseClient;
            _httpClientFactory = httpClientFactory;

        }
        public ProcessedPointData ProcessPoints(List<PostRequestPoints> points, Guid routeID)  {
            float distance = 0;
            int interval_length = 5000;
            var routePoints = new List<PointModel>();
            var weatherPoints = new List<WeatherModel>();

            for(int i = 0; i < points.Count-1; i++) {
    	        int elevtation;
                if (Int32.TryParse(points[i].Ele.ToString(), out elevtation)  && (points[i].Lat != points[i+1].Lat) && (points[i].Lon != points[i+1].Lon)) {
                    
                    float pointDistance = distance;
                    distance += DistanceBetweenPoints(points[i].Lat, points[i+1].Lat, points[i].Lon, points[i+1].Lon);
                    float pointDirectionToNextPoint = BearingBetweenPoints(points[i].Lat, points[i+1].Lat, points[i].Lon, points[i+1].Lon);
                    if(pointDistance <= interval_length*weatherPoints.Count && distance >= interval_length*weatherPoints.Count) {
                        var weather = new WeatherModel {
                            RouteId = routeID,
                            Latitude = points[i].Lat, 
                            Longitude = points[i].Lon,
                            Id = Guid.NewGuid()
                            
                        };
                        weatherPoints.Add(weather); 
                    }
                    var point = new PointModel { 
                        Latitude = points[i].Lat, 
                        Longitude = points[i].Lon,
                        Elevation = elevtation,
                        DistanceStart = pointDistance,
                        DistanceEnd = distance,
                        Direction = pointDirectionToNextPoint,
                        WeatherId = weatherPoints[weatherPoints.Count-1].Id,
                        RouteId = routeID
                    };
                    routePoints.Add(point);

                }
            
            }
            var output = new ProcessedPointData {
                points = routePoints,
                weatherPoints = weatherPoints,
                routeDistance = distance
            };
            return output;
        }

        async public Task<List<WeatherModel>> FetchWeatherAtPoints(List<WeatherModel> weatherPoints, DateTime routeDate)  {
            var formattedDate = routeDate.Date.ToString("yyyy-MM-dd");
            var updatedWeatherPoints = new List<WeatherModel>();
            var httpClient = _httpClientFactory.CreateClient();

            foreach(WeatherModel point in weatherPoints ) {
                var requestString = String.Format("https://api.open-meteo.com/v1/forecast?latitude={0}&longitude={1}&hourly=windspeed_10m,winddirection_10m,windgusts_10m&start_date={2}&end_date={2}&timezone=auto", point.Latitude, point.Longitude, formattedDate);
                var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, requestString);
                var httpResponseMessage = await httpClient.SendAsync(httpRequestMessage);
                if (httpResponseMessage.IsSuccessStatusCode) {
                    var repsonseJSONString = await httpResponseMessage.Content.ReadAsStreamAsync();
                    var weatherData = await JsonSerializer.DeserializeAsync<OpenMeteoResponseFormat>(repsonseJSONString);
                    var dateHour = Int32.Parse(routeDate.Date.ToString("HH"));
                    var weather = new WeatherModel {
                        RouteId = point.RouteId,
                        Latitude = point.Latitude, 
                        Longitude = point.Longitude,
                        Id = point.Id,
                        WindSpeed = weatherData.hourly.windspeed_10m[dateHour],
                        WindSpeedGust = weatherData.hourly.windgusts_10m[dateHour],
                        WindDirection = weatherData.hourly.winddirection_10m[dateHour]
                    };
                    updatedWeatherPoints.Add(weather); 
                }
            }
            return updatedWeatherPoints;
                

        }
        public float DistanceBetweenPoints(float lat1, float lat2, float lon1, float lon2) {
            float earthRadius = 6371000; 
            float theta1 = lat1 * (float) Math.PI/180; // φ, λ in radians
            float theta2 = lat2 * (float) Math.PI/180;
            float delta_theta = (lat2-lat1) * (float) Math.PI/180;
            float delta_lambda = (lon2-lon1) * (float) Math.PI/180;

            float a = (float) Math.Sin(delta_theta/2) * (float)Math.Sin(delta_theta/2) +
                        (float) Math.Cos(theta1) * (float) Math.Cos(theta2) *
                        (float) Math.Sin(delta_lambda/2) * (float) Math.Sin(delta_lambda/2);
            float c = 2 * (float) Math.Atan2(Math.Sqrt(a), Math.Sqrt(1-a));

            float d = earthRadius * c; // in metres
            return d; 
        }
        public float BearingBetweenPoints(float lat1, float lat2, float lon1, float lon2) { 
            float y = (float) Math.Sin(lon2-lon1) * (float) Math.Cos(lat2);
            float x = (float) Math.Cos(lat1) * (float) Math.Sin(lat2) -
                        (float) Math.Sin(lat1) * (float) Math.Cos(lat2) * (float) Math.Cos(lon2-lon1);
            float theta = (float) Math.Atan2((y), (x));
            float bearing = (float) (theta*180/Math.PI + 360) % 360; // in degrees

            

            return bearing;
        }
    }
}

