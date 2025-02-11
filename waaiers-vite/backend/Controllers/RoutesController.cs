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
                return NotFound();
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
        [HttpPost]
        public async Task<ActionResult<ResponseRoute>> PostRouteItem(PostRequestRoute request)
        {
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
                var weatherPoints = await _pointService.FetchWeatherAtPoints(processedPointData.weatherPoints, request.Date);
                
                await _supabaseClient.From<WeatherModel>().Insert(weatherPoints);
                await _supabaseClient.From<PointModel>().Insert(processedPointData.points);

                var response = new ResponseRoute {
                    RouteName = request.Name,
                    Date = request.Date,
                    Distance = processedPointData.routeDistance,
                    Id = supabaseResponse.Model.Id,
                    Displayed = false
                };


                
                return CreatedAtAction("GetRoute", new { id = response.Id }, response);
            }
            return NotFound();
           
        }

        // POST: api/RouteItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("updatestatus")]
        public async Task<ActionResult<ResponseRoute>> PostRouteStatusUpdate(RouteStausUpdate request)
        {
            
            var supabaseResponse = await _supabaseClient.From<RouteModel>().Where(x => x.Id == request.Id).Set(x => x.Displayed, request.IsDisplayed).Update();
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
                return CreatedAtAction("GetRoute", new { id = response }, supabaseResponse.Model);
            }
        }

        // DELETE: api/RouteItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRouteItem(Guid id)
        {
            var route = await _supabaseClient.From<RouteModel>().Where(x => x.Id == id).Get();
            if (route.Model == null)
            {
                return NotFound();
            } 
            await _supabaseClient.From<RouteModel>().Where(x => x.Id == id).Delete();
            return StatusCode(200);
        }

        // GET: api/RouteItems/display/{id}
        [HttpGet("segments/{id}")]
        public async Task<ActionResult<IEnumerable<ReturnedSegment>>> GetRouteSegments (Guid id)
        {
            var route = await _supabaseClient.From<RouteModel>().Where(x => x.Id == id).Get();
            if (route.Model == null)
            {
                return NotFound();
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
    }
}
