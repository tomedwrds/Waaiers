using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Interfaces;
using Supabase;
using Azure;
using System.Text.Json;
using Newtonsoft.Json;
using Microsoft.Net.Http.Headers;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RouteController : ControllerBase
    {
        private readonly Supabase.Client _supabaseClient;
        private readonly Interfaces.IPointService _pointService;
        private readonly Interfaces.ISegmentService _segmentService;


        public RouteController(Client supabaseClient, IPointService pointService, ISegmentService segmentService)
        {
            _supabaseClient = supabaseClient;
            _pointService = pointService;
            _segmentService = segmentService;

        }

        // GET: api/RouteItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ResponseRoute>>> GetRouteItems()
        {
            var routes = await _supabaseClient.From<RouteModel>().Get();
            //parse supabase data into response format
            List<ResponseRoute> responses = [];
            foreach(RouteModel response in routes.Models) {
                var newResponse = new ResponseRoute {
                    RouteName = response.Name,
                    Date = response.Date,
                    Distance = response.Distance,
                    Id = response.Id,
                    Displayed = response.Displayed
                };
                responses.Add(newResponse);
            }
            return responses;
        }

        // GET: api/RouteItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseRoute>> GetRoute(Guid id)
        {
            var route = await _supabaseClient.From<RouteModel>().Where(x => x.Id == id).Get();
             if (route.Model == null)
            {
                return UnprocessableEntity();
            }
            var newResponse = new ResponseRoute {
                    RouteName = route.Model.Name,
                    Date = route.Model.Date,
                    Distance = route.Model.Distance,
                    Id = route.Model.Id,
                    Displayed = route.Model.Displayed
                };
            return newResponse;
        }

        

        // POST: api/RouteItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Generate")]
        public async Task<IEnumerable<ReturnedSegment>> GenerateUploadRoute(PostRequestRoute request)
        {
            if(await checkUserAdmin(Request.Cookies["uuid"])) {
                    var model = new RouteModel {
                    Name = request.Name,
                    Date = request.Date,
                };
                var supabaseResponse = await _supabaseClient.From<RouteModel>().Insert(model);
                if(supabaseResponse.Model != null) {
                    //get proccessed points
                    var processedPointData = _pointService.ProcessPoints(request.Points, supabaseResponse.Model.Id);
                    
                    //set route distance
                    var update = await _supabaseClient.From<RouteModel>().Where(x => x.Id == supabaseResponse.Model.Id).Set(x => x.Distance, processedPointData.routeDistance).Update();
                    
                    //get weather
                    var weatherPoints = await _pointService.FetchWeatherAtPoints(processedPointData.weatherPoints, request.Date, supabaseResponse.Model.Id);
                    await _supabaseClient.From<WeatherModel>().Insert(weatherPoints);
                    await _supabaseClient.From<PointModel>().Insert(processedPointData.points);

                    var response = new ResponseRoute {
                        RouteName = request.Name,
                        Date = request.Date,
                        Distance = processedPointData.routeDistance,
                        Id = supabaseResponse.Model.Id,
                        Displayed = 0
                    };
                }
                return [];
            } else {
                var model = new RouteModel {
                    Name = request.Name,
                    Date = request.Date,
                };
                var routeId = Guid.NewGuid();
                var processedPointData = _pointService.ProcessPoints(request.Points, routeId);
                var weatherPoints = await _pointService.FetchWeatherAtPoints(processedPointData.weatherPoints, request.Date, routeId);
                
                var segmentPoints = new List<SegmentPointsRPCResponse>();
                var weatherPointIndex = 0;
                foreach(var point in processedPointData.points) {
                    if(weatherPoints[weatherPointIndex].Id != point.WeatherId) {
                        weatherPointIndex += 1;
                    }
                    var weatherPoint = weatherPoints[weatherPointIndex];
                    var segmentPoint = new SegmentPointsRPCResponse {
                        latitude = point.Latitude,
                        longitude = point.Longitude,
                        direction = point.Direction,
                        distance_end = point.DistanceEnd,
                        distance_start = point.DistanceStart,
                        wind_direction = weatherPoint.WindDirection,
                        wind_speed = weatherPoint.WindSpeed,
                        wind_speed_gust = weatherPoint.WindSpeedGust
                    };
                    segmentPoints.Add(segmentPoint);
                    }

                    return _segmentService.GenerateSegments(segmentPoints);
                }
           
        }
        // POST: api/RouteItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Update/Display")]
        public async Task<ActionResult<ResponseRoute>> PostRouteStatusUpdate(RouteStausUpdate request)
        {
            if(await checkUserAdmin(Request.Cookies["uuid"])) {
                var supabaseResponse = await _supabaseClient.From<RouteModel>().Where(x => x.Id == request.Id).Set(x => x.Displayed, request.DisplayStatus).Update();
                if(supabaseResponse.Model == null) {
                    return StatusCode(500);
                } else {
                    var response = new ResponseRoute {
                        RouteName = supabaseResponse.Model.Name,
                        Date = supabaseResponse.Model.Date,
                        Distance = supabaseResponse.Model.Distance,
                        Id = supabaseResponse.Model.Id,
                        Displayed = supabaseResponse.Model.Displayed
                    };
                    return Ok();
                }
            }
            return Unauthorized();
            
        }

        // DELETE: api/RouteItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRouteItem(Guid id)
        {
            if(await checkUserAdmin(Request.Cookies["uuid"])) {
                var route = await _supabaseClient.From<RouteModel>().Where(x => x.Id == id).Get();
                if (route.Model == null)
                {
                    return UnprocessableEntity();
                } 
                await _supabaseClient.From<RouteModel>().Where(x => x.Id == id).Delete();
                return Ok();
            }
            return Unauthorized();
        }

        // GET: api/RouteItems/display/{id}
        [HttpGet("Segments/{id}")]
        public async Task<ActionResult<IEnumerable<ReturnedSegment>>> GetRouteSegments (Guid id)
        {
            var route = await _supabaseClient.From<RouteModel>().Where(x => x.Id == id).Get();
            if (route.Model == null)
            {
                return UnprocessableEntity();
            }
            if(route.Model.Displayed == 0) {
                return Unauthorized();
            }
            List<SegmentPointsRPCResponse> weatherPointDataReturned;
            var weatherPointsData = new List<SegmentPointsRPCResponse>();
            var index = 0;
            do {
                var rpcRequest = new SegmentPointsRPCRequest {
                    route = id,
                    index_offset = index
                };
                var data = await _supabaseClient.Rpc("get_points_weather",rpcRequest);
                weatherPointDataReturned = JsonConvert.DeserializeObject<List<SegmentPointsRPCResponse>>(data.Content);
                weatherPointsData.AddRange(weatherPointDataReturned);
                index += 1000;
            } while(weatherPointDataReturned.Count == 1000);
           
            return _segmentService.GenerateSegments(weatherPointsData);
        }

        // GET: api/Route/update/{id}
        [HttpPost("Update/Weather")]
        public async Task<ActionResult> UpdateRouteSegments (UpdateWeatherRequest request)
        {
            if(await checkUserAdmin(Request.Cookies["uuid"])) {
                var route = await _supabaseClient.From<RouteModel>().Where(x => x.Id == request.Id).Get();
                if (route.Model == null)
                {
                    return UnprocessableEntity();
                }
                var weatherPoints = new List<WeatherModel>();
                var index = 0;
                do {
                    var rpcRequest = new SegmentPointsRPCRequest {
                        route = request.Id,
                        index_offset = index
                    };
                    var data = await _supabaseClient.From<WeatherModel>().Where(x => x.RouteId == request.Id).Range(index).Get(); 
                    var weatherPointDataReturned = JsonConvert.DeserializeObject<List<WeatherModel>>(data.Content);
                    weatherPoints.AddRange(weatherPointDataReturned);
                    index += 1000;
                } while(weatherPoints.Count % 1000 == 0);

                var updatedWeatherPoints = await _pointService.FetchWeatherAtPoints(weatherPoints, route.Model.Date, request.Id);

                var response = await _supabaseClient.From<WeatherModel>().Upsert(updatedWeatherPoints);
                if(response.ResponseMessage.IsSuccessStatusCode) {
                    return Ok();
                }
                return StatusCode(500);
            }
            return Unauthorized();
           
        }
            private async Task<bool> checkUserAdmin(string cookie) {
            if(cookie != null) {
                var authID = new Guid(cookie);
                var response = await _supabaseClient.From<AdminModel>().Where(x => x.Uuid == authID).Get();
                if(response.Model != null) {
                    return true;
                }
            }
            return false;
        }
        
    }
    
}
