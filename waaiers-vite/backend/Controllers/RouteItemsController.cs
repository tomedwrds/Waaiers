using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Services;
using Supabase;
using Azure;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RouteItemsController : ControllerBase
    {
        private readonly Supabase.Client _supabaseClient;


        public RouteItemsController(Supabase.Client supabaseClient)
        {
            _supabaseClient = supabaseClient;

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
            float routeDistance = 0; //PointService.ProcessPoints(request.Points, _contextPoints, _supabaseClient);
            var update = await _supabaseClient.From<RouteModel>().Where(x => x.Id == supabaseResponse.Model.Id).Set(x => x.Distance, routeDistance).Update();
            var response = new ResponseRoute {
                RouteName = request.Name,
                Date = request.Date,
                Distance = routeDistance,
                Id = supabaseResponse.Model.Id,
                Displayed = false
            };
            
            return CreatedAtAction("GetRoute", new { id = response.Id }, response);
        }

        // POST: api/RouteItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("updatestatus")]
        public async Task<ActionResult<ResponseRoute>> PostRouteStatusUpdate(RouteStausUpdate request)
        {
            
            var supabaseResponse = await _supabaseClient.From<RouteModel>().Where(x => x.Id == request.Id).Set(x => x.Displayed, request.IsDisplayed).Update();
            if(supabaseResponse.Model == null) {
                return NotFound();
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
    }
}
