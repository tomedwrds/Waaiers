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
    //const [selectedDataPoint,setSelectedDatapoint] = useState([0,0])
    const [segmentsSort,setSegmentSort] = useState("stars")
    const [windDir,setWindDir] = useState("all")

    // //Set up the map paramters for the generation of Segments
    // const [segmentParameters,setSegmentParameters] = useState({
    //     minWindSpeed: 10,
    //     maxWindSpeed: 30,
    //     minSegmentLength: 1000,
    //     maxSegmentLength: 10000,
    //     windAngleGolden: 75,
    //     windAngleZone: 30
    // })

    useEffect(() => {
        async function loadSegmentData() {
            const routeID = window.location.pathname.split('/')[2];

            try {
                const response = await fetch("https://localhost:7276/api/Route/segments/" + routeID)
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const data = await response.json()

                setSegments(data)

            } catch (error) {
                console.error(error.message);
            }

            try {
                const response = await fetch("https://localhost:7276/api/Route/" + routeID)
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const data = await response.json()
                setRouteData(data)

            } catch (error) {
                console.error(error.message);
            }
        }
        loadSegmentData()

    }, [])

    if(segments != null && routeData != null)
    {
        if(false)
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
                   
                    <RouteWindMap segmentData = {segments} windDirection = {windDir}  />
                    {/* selectedDataPoint ={selectedDataPoint} */}
        
                    <div className='segmentIntrestHeader'>
                        <h2>Route Wind Profile</h2>  
                        
                    </div>
                    
                    { /*  <MapProfile segmentData = {segments} /> setSelectedDatapoint = {setSelectedDatapoint} */}
                    {/* 
                   
                     */}
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