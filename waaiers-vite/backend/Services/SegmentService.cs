using backend.Models;
using backend.Interfaces;
using System.Text.Json;
using Microsoft.CodeAnalysis.FlowAnalysis.DataFlow.PointsToAnalysis;
namespace backend.Services {
    public class SegmentService : ISegmentService {

        public List<ReturnedSegment> GenerateSegments(List<SegmentPointsRPCResponse> weatherPoints)  {
            //CONSTANTS
            var segmentSensitivity = 60;
            var windAngleGolden = 75;
            var windAngleZone = 30;
            var minWindSpeed = 10;
            var maxWindSpeed = 30;
            var minSegmentLength = 750;
            var maxSegmentLength = 10000;
            
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
            

            for(var i = 0; i < weatherPoints.Count; i ++) {
                var currentPoint = weatherPoints[i];
                var windAngleRider = getWindDirRelative(currentPoint.direction, currentPoint.wind_direction);
                var avgRelativeWind = currentSegmentWindRelative.Average();
                
                if(windAngleRider >= avgRelativeWind - segmentSensitivity && windAngleRider <= avgRelativeWind + segmentSensitivity && i != weatherPoints.Count-1 ) { 
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
                    var segmentDifficulty = -1d;
                    var segmentClassification = "none";
                    var segmentLength = segmentKmEnd - segmentKmStart;
                    if(segmentLength > minSegmentLength) {
                        segmentDifficulty = 0;


                        var segmentWindCross = (avgRelativeWind < (windAngleGolden+windAngleZone) && avgRelativeWind > (windAngleGolden-windAngleZone)) || (avgRelativeWind < (windAngleGolden+windAngleZone+210) && avgRelativeWind > (windAngleGolden-windAngleZone+210));
                        
                        var segmentWindHead = avgRelativeWind >= windAngleGolden+windAngleZone && avgRelativeWind <= (windAngleGolden-windAngleZone+210);
                        if(segmentWindHead) {
                            segmentClassification = "head";
                        }
                        var segmentWindTail =  avgRelativeWind <= (windAngleGolden-windAngleZone) || avgRelativeWind >= (windAngleGolden+windAngleZone+210);
                        if(segmentWindTail) {
                            segmentClassification = "tail";
                        }
                        if ((segmentWindCross | segmentWindHead | segmentWindTail) && (currentSegmentWindSpeed.Average() > minWindSpeed)) {
                            segmentDifficulty += Math.Min(segmentLength/maxSegmentLength,1)*0.5;
                            segmentDifficulty += Math.Min(currentSegmentWindSpeed.Average()/maxWindSpeed,1)*1.5;
                            if(segmentWindCross) { 
                                segmentClassification = "cross";
                                segmentDifficulty += Math.Max( 1-Math.Abs(avgRelativeWind-windAngleGolden)/windAngleZone,1-Math.Abs(avgRelativeWind-(windAngleGolden+210))/windAngleZone);
                                segmentDifficulty = Math.Min(segmentDifficulty*1.2, 3);
                            } else if(segmentWindHead) {
                                segmentClassification = "head";
                                segmentDifficulty +=  1-Math.Abs(avgRelativeWind-180)/75;
                                segmentDifficulty = Math.Min(segmentDifficulty, 1);
                            } else {
                                segmentClassification = "tail";
                                segmentDifficulty +=  Math.Max( 1-Math.Abs(avgRelativeWind)/45,1-Math.Abs(avgRelativeWind-360)/45);
                                segmentDifficulty = Math.Min(segmentDifficulty, 1.5);
                            }


                        }
                    } 
                    var meterePerPoint  = segmentLength/currentPoints.Count;
                    var ratioRequired = meterePerPoint/200;

                    if(ratioRequired < 1) {
                        var nthKeep = Math.Round(1/ratioRequired);

                        var filteredPoints = new List<SegmentPoints>();
                        filteredPoints.Add(currentPoints[0]);
                        for(int j = 1; j < currentPoints.Count-1; j ++) {
                            if(j % nthKeep == 0) {
                                filteredPoints.Add(currentPoints[j]);
                            }
                        }
                        filteredPoints.Add(currentPoints[currentPoints.Count-1]);
                        currentPoints = filteredPoints;
                    }

                    var newSegment = new ReturnedSegment {
                        Points = currentPoints,
                        DistanceStart = segmentKmStart,
                        DistanceEnd = segmentKmEnd,
                        WindDirection = currentSegmentWindAngle.Average(),
                        WindSpeed = currentSegmentWindSpeed.Average(),
                        WindSpeedGust = currentSegmentWindSpeedGust.Average(),
                        Difficulty = segmentDifficulty,
                        Classification = segmentClassification
                    };
                    segments.Add(newSegment);
                    
                    

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