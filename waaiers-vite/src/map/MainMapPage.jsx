import { useEffect, useState } from 'react';
import RouteWindMap from './RouteWindMap';
import IntrestSegmentContainer from '../segments of intrest/IntrestSegmentContainer';
import { useLocation } from 'react-router-dom';
import generateMapData from './generateMapData';
import getUserAccessStatus from '../upload route/getUserData';






const MainMapPage = () => {
    
   

    //Create the postion and segments state hook
    const [positions,setPositions] = useState(null);
    const [segments,setSegments] = useState(null);
    const [routeData, setRouteData] = useState(null);

    


    //Maybe look at ways to clear this so there isnt a massive object cached
    const {state} = useLocation();
    
    useEffect(() => {
        //Fetches the weather data on page load
        generateMapData(state.pointData,setPositions,setSegments);

        //Also gets the route data
        setRouteData(state.routeData);
    }, [])

    //Dont attempt to render anything until the route data has loaded
    if(routeData != null)
    {
        return(
        <div className = "body">  
            <h1 style = {{borderTop: '2px solid black',borderBottom: '2px solid black',paddingTop: '10px',paddingBottom: '10px'}}>{routeData.route_name}</h1>
            <RouteWindMap pointData = {positions} routeData = {routeData} />
            <h1 style = {{borderTop: '2px solid black',borderBottom: '2px solid black',paddingTop: '10px',paddingBottom: '10px'}}>Segments of Intrest</h1>
            <IntrestSegmentContainer data = {segments}/>
        </div>
        )
    }
}

export default MainMapPage