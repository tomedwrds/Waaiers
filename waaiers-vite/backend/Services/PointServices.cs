using backend.Models;

namespace backend.Services {
    public static class PointService {
        async public static void ProcessPoints(List<PostRequestPoints> points, backend.Models.PointContext pointContext, Supabase.Client supabaseClient)  {
            float distance = 0;
            int kmInterval = 5;

            for(int i = 0; i < points.Count-1; i++) {
                //check for point duplication
    	        int elevtation;
                if (Int32.TryParse(points[i].Ele.ToString(), out elevtation)  && (points[i].Lat != points[i+1].Lat) && (points[i].Lon != points[i+1].Lon)) {
                    
                    float pointDistance = distance;
                    distance += DistanceBetweenPoints(points[i].Lat, points[i+1].Lat, points[i].Lon, points[i+1].Lon);
                    float pointDirectionToNextPoint = BearingBetweenPoints(points[i].Lat, points[i+1].Lat, points[i].Lon, points[i+1].Lon);
                    
                    //weather stuff todo here
                    PointItem point = new PointItem { 
                        Id = Guid.NewGuid(),
                        Latitude = points[i].Lat, 
                        Longitude = points[i].Lon,
                        Elevation = elevtation,
                        DistanceStart = pointDistance,
                        DistanceEnd = distance,
                        Direction = pointDirectionToNextPoint,
                        WeatherID = Guid.NewGuid()
                    };

                    pointContext.Add(point);
                }

            }
        }

        private static float DistanceBetweenPoints(float lat1, float lat2, float lon1, float lon2) {
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
        private static float BearingBetweenPoints(float lat1, float lat2, float lon1, float lon2) { 
            float y = (float) Math.Sin(lon2-lon1) * (float) Math.Cos(lat2);
            float x = (float) Math.Cos(lat1) * (float) Math.Sin(lat2) -
                        (float) Math.Sin(lat1) * (float) Math.Cos(lat2) * (float) Math.Cos(lon2-lon1);
            float theta = (float) Math.Atan2((y), (x));
            float bearing = (float) (theta*180/Math.PI + 360) % 360; // in degrees

            

            return bearing;
        }
    }
}

