import { useEffect, useState } from 'react';
import RouteWindMap from './RouteWindMap';
import IntrestSegmentContainer from '../segments of intrest/IntrestSegmentContainer';
import { useLocation } from 'react-router-dom';
import generateMapData from './generateMapData';






const MainMapPage = () => {
    
   

    //Create the postion and segments state hook
    const [positions,setPositions] = useState(null);
    const [segments,setSegments] = useState(null);


    //Maybe look at ways to clear this so there isnt a massive object cached
    const {state} = useLocation();
    
    useEffect(() => {
        //Fetches the weather data on page load
        console.log(state.pointData)
        generateMapData(state.pointData,setPositions,setSegments);
    }, [])
    

    return(
        <div className = "body">  
             <h1 style = {{borderTop: '2px solid black',borderBottom: '2px solid black',paddingTop: '10px',paddingBottom: '10px'}}>Omloop heit Neuwsiblad</h1>
            <RouteWindMap data = {positions} />
            <h1 style = {{borderTop: '2px solid black',borderBottom: '2px solid black',paddingTop: '10px',paddingBottom: '10px'}}>Segments of Intrest</h1>
        
            <IntrestSegmentContainer data = {segments}/>
      </div>
    )
}

export default MainMapPage