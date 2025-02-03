using backend.Models;
using backend.Interfaces;
using System.Text.Json;
namespace backend.Services {
    public class SegmentService : ISegmentService {

        public List<ReturnedSegment> GenerateSegments(List<SegmentPointsRPCResponse> weatherPoints)  {
            //CONSTANTS
            var segmentSensitivity = 40;
            
            var segments = new List<ReturnedSegment>();
            var initalPoint = new SegmentPoints {
                Elevation = weatherPoints[0].elevation,
                Latitude = weatherPoints[0].latitude,
                Longitude = weatherPoints[0].longitude
            };
            var currentPoints = new List<SegmentPoints> {initalPoint};

            var currentSegmentWindSpeed = new List<float> {weatherPoints[0].wind_speed};
            var currentSegmentWindSpeedGust = new List<float> {weatherPoints[0].wind_speed_gust};
            var currentSegmentWindAngle = new List<float> {weatherPoints[0].wind_direction};
            
            var currentSegmentWindRelative = new List<float> {getWindDirRelative(weatherPoints[0].direction, weatherPoints[0].wind_direction)};
            var segmentKmStart = weatherPoints[0].distance_start;
            var segmentKmEnd = weatherPoints[0].distance_end;
            
            var mergedSegment = new ReturnedSegment {
                Points = new List<SegmentPoints>(),
                DistanceStart = 0,
                DistanceEnd = 0,
                WindDirection = 0,
                WindSpeed = 0,
                WindSpeedGust = 0,
                Difficulty = 0
            };
            

            for(var i = 0; i < weatherPoints.Count/2; i ++) {
                var currentPoint = weatherPoints[i];
                var windAngleRider = getWindDirRelative(currentPoint.direction, currentPoint.wind_direction);
                var avgRelativeWind = currentSegmentWindRelative.Average();
                
                if(windAngleRider >= avgRelativeWind - segmentSensitivity && windAngleRider <= avgRelativeWind + segmentSensitivity) {
                    currentSegmentWindSpeed.Add(currentPoint.wind_speed);
                    currentSegmentWindSpeedGust.Add(currentPoint.wind_speed_gust);
                    currentSegmentWindAngle.Add(currentPoint.wind_direction);
                    currentSegmentWindRelative.Add(windAngleRider);
                    segmentKmEnd = currentPoint.distance_end;
                        var newPoint = new SegmentPoints {
                        Elevation = currentPoint.elevation,
                        Latitude = currentPoint.latitude,
                        Longitude = currentPoint.longitude
                    };
                    currentPoints.Add(newPoint);

                    
                } else {
                    var segmentLength = segmentKmEnd - segmentKmStart;
                    var segmentDifficulty = 0;

                    if(segmentLength > 1000) {
                        segmentDifficulty = 0;
                    }

                    if(segmentDifficulty > 0) {
                        //flush the merged segments
                        if(mergedSegment.Points.Count > 0) {
                            segments.Add(mergedSegment);
                            mergedSegment.Points = [];
                        }

                        var newSegment = new ReturnedSegment {
                            Points = currentPoints,
                            DistanceStart = segmentKmStart,
                            DistanceEnd = segmentKmEnd,
                            WindDirection = currentSegmentWindAngle.Average(),
                            WindSpeed = currentSegmentWindSpeed.Average(),
                            WindSpeedGust = currentSegmentWindSpeedGust.Average(),
                            Difficulty = segmentDifficulty
                        };
                        segments.Add(newSegment);
                    } else {
                        mergedSegment.Points.AddRange(currentPoints);
                    }
                    

                    //Start new segment
                    var newPoint = new SegmentPoints {
                        Elevation = currentPoint.elevation,
                        Latitude = currentPoint.latitude,
                        Longitude = currentPoint.longitude
                    };
                    currentPoints = [newPoint];
                    currentSegmentWindSpeed = [currentPoint.wind_speed];
                    currentSegmentWindSpeedGust = [currentPoint.wind_speed_gust];
                    currentSegmentWindAngle = [currentPoint.wind_direction];
                    currentSegmentWindRelative = [getWindDirRelative(currentPoint.direction, currentPoint.wind_direction)];
                    segmentKmStart = currentPoint.distance_start;
                    segmentKmEnd = currentPoint.distance_end;
                }
            

            }
            Console.WriteLine(segments.Count);
            return segments;

        }
        public float getWindDirRelative(float pointDir, float windDir) {
        var windDirRiderRelative = (windDir + 180) % 360;
        var windAngleRider = pointDir - windDirRiderRelative;
        if(windAngleRider < 0) {
            windAngleRider += 360;
        }
        return windAngleRider;
    }
    }
}