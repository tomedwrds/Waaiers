import { useEffect, useState } from 'react';
import RouteWindMap from './RouteWindMap';
import IntrestSegmentContainer from '../segments of intrest/IntrestSegmentContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import generateMapData from './generateMapData';
import getUserAccessStatus from '../upload route/getUserData';
import supabase from '../supabase/supabase';



import './MainMapPage.css'

import MapProfile from './MapProfile';
import Loading from './Loading';
import getIntrestRace from './getIntrestRace';


const MainMapPage = () => {
    
  

    const [segments,setSegments] = useState(null);
    const [routeData,setRouteData] = useState(null);
    const [segmentsSort,setSegmentSort] = useState("stars")
    const [windDir,setWindDir] = useState("all")

  

    useEffect(() => {
        async function loadSegmentData() {
            let routeID = window.location.pathname.split('/')[2];
            if (routeID == "view") {
                let segments = JSON.parse(window.localStorage.getItem("userGenerateRoute"))
                if(segments) {
                    setSegments(segments)
                    setRouteData({name: window.localStorage.getItem("name")})
                }
            } else {

                try {
                    const response = await fetch(import.meta.env.VITE_BASE_API_STRING + "/Route/" + routeID)
                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`);
                    }
                    const data = await response.json()
                    setRouteData(data)
    
                } catch {
                    try {
                        //If route not valid choose next to occur one
                        const response = await fetch(import.meta.env.VITE_BASE_API_STRING + "/Route/")
                        if (!response.ok) {
                            throw new Error(`Response status: ${response.status}`);
                        }
                        const routes = await response.json()

                        const validRoutes = routes.filter(route => route.displayed != 0)
                        validRoutes.sort((a,b) => {
                            return new Date(b.date) - new Date(a.date);
                          });
                        routeID = validRoutes[0].id

                        setRouteData(validRoutes[0])
                    } catch(error) {
                        //todo proper error handling for if load fails
                        console.error(error.message);
                    }
                }
    
                try {
                    const response = await fetch(import.meta.env.VITE_BASE_API_STRING + "/Route/segments/" + routeID)
                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`);
                    }
                    const data = await response.json()
                    setSegments(data)
                } catch (error) {
                    console.error(error.message);
                }
            }
            
        }
        loadSegmentData()

    }, [])

    if(segments != null && routeData != null)
    {
        if(routeData.displayed == 1)
        {
            return(
                <div className = "body-locked">  
                    <div className='mainMapHeader'>
                        <h2>{routeData.route_name}</h2>
                    </div>
                    <div style={{marginTop:'120px',marginBottom:'120px'}}>  
                    <h2 style={{marginBottom:'0px'}}>Check back Later</h2>
                    <p style={{marginTop:'5px',color:'grey'}}>Waaiers wind maps release seven days before a race starts</p>
                </div>
                </div>

            )
        }
        else{
            return(
                <div className = "body">  
                    <div className='mainMapHeader'>
                        <h2>{routeData.routeName}</h2>
                            <div className='segmentIntrestSort'>
                                <p>Wind Direction:</p>
                                <select className='segmentIntrestSelect' onChange={(e)=>setWindDir(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="cross">Cross</option>
                                    <option value="head">Head</option>
                                    <option value="tail">Tail</option>
                                </select>
                            </div>
                    </div>
                   
                    <RouteWindMap segmentData = {segments} dispalyedWindDir = {windDir}  />
                    {/* selectedDataPoint ={selectedDataPoint} */}
        
                    <div className='segmentIntrestHeader'>
                        <h2>Route Wind Profile</h2>  
                        
                    </div>
                    
                    <MapProfile segments = {segments} routeData = {routeData}/> 
                    {/* setSelectedDatapoint = {setSelectedDatapoint}  */}
                    
                      <div className='segmentIntrestHeader'>
                         <h2>Segments of Interest</h2>
                         <div className='segmentIntrestSort'>
                             <p>Sort by:</p>
                             <select className='segmentIntrestSelect' onChange={(e)=>setSegmentSort(e.target.value)}>
                                 <option value="stars">Stars</option>
                                 <option value="order">Order</option>
                             </select>
                         </div>
                        
                    </div>
        
        
                    
                    <IntrestSegmentContainer data = {segments} sortOrder = {segmentsSort} windDirection = {windDir} />
                </div>
                )
            
        }
        
    }
    else{
        return(
            <Loading/>
        )
    }
}


export default MainMapPage