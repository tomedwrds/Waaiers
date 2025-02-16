
import { useEffect, useState } from 'react';
import getUserAccessStatus from './getUserData';
import { Link, useNavigate } from "react-router-dom";
import './UploadRoute.css'
import ErrorModal from './ErrorModal';
import { XMLParser } from 'fast-xml-parser';

function UploadRoute() 
{
    const [routeGpxData, setRouteGPXData] = useState(null);
    const navigate = useNavigate();

    const[routeData,setRouteData] = useState({route_name:null,route_date:null,route_time:null})
    const[errorModal, setErrorModal] = useState({error_name: "", error_desc: ""})
    const[userAdmin,setUserAdmin] = useState(false)

    useEffect(()=>{
        getUserAccessStatus(setUserAdmin);
    },[])

    
    const readFile = (e) => {
        try {
            const file = e.target.files[0];
            if (file) 
            {
                const fileReader = new FileReader();
                fileReader.readAsText(file);
                fileReader.onload = (e) => {
                    setRouteGPXData(e.target.result)
                }
            }
        } catch(e) {

        }
    }

    //Helper function that checks if GPX file is in valid format or not
    async function addRoute()
    {
        //validate date
        const current_date = new Date()
        const route_date =  new Date(routeData.route_date) 
        const daysBetween = (route_date.getTime() - current_date.getTime()) / (1000 * 3600 * 24);
        if(daysBetween > 14)
        {
            setErrorModal({error_name: "Race Data Error", error_desc:'Date given is to far away. Date must be withn two weeks of current date.'})
        }
        else
        {    
            const options = {
                ignoreAttributes : false,
                attributeNamePrefix: "",
                parseAttributeValue: true
            };
            const gpxParser = new XMLParser(options);
            let gpx
            try{
               
                gpx = gpxParser.parse(routeGpxData);
            }
            catch(err) {
                console.error(err)
                setErrorModal({error_name: "GPX File Error", error_desc: "The GPX file you have provided lacks required information for Waaiers to run. This is an unfortunate consequence of how data is stored in GPX not being standardized. A detailed solution to this can be found on the FAQ page, however an easy work around is to either download the GPX file for a route you have already done off a platform such as Strava or Garmin OR quickly recreate the route on a site that creates GPX data compatible with Waaiers such as <a href={'https://www.maps.ie/map-my-route/'}>www.maps.ie/map-my-route/</a> and save then download the GPX file from that."})
                return
            }
            const parsedPoints = gpx.gpx.trk.trkseg.trkpt;
            let combineDateTime = new Date(Date.parse(routeData.route_date + ' ' + routeData.route_time));

            try {
                if(true) {
                    await fetch("https://localhost:7276/api/Route/Generate/Upload", {
                        method: "POST",
                        body: JSON.stringify({
                            name:  routeData.route_name,
                            date: combineDateTime,
                            points: parsedPoints,
                        }),
                        headers: {
                            "Content-type": "application/json"
                        }
                    });
                } else {
                    const resp = await fetch("https://localhost:7276/api/Route/Generate/View", {
                        method: "POST",
                        body: JSON.stringify({
                            name:  routeData.route_name,
                            date: combineDateTime,
                            points: parsedPoints,
                        }),
                        headers: {
                            "Content-type": "application/json"
                        }
                    });
                    const segments = await resp.json()
                    window.localStorage.setItem("userGenerateRoute", JSON.stringify(segments))
                    window.localStorage.setItem("userGenerateName", routeData.route_name)
                    navigate('/race/view' );
                }
                
                
            } catch(e) {
                setErrorModal({error_name: "Error", error_desc: "Looks like something went wrong. Try generating the route again and if that doesnt work it is likely a server issue."})
                console.error(e)
            }

        }
    }

    

    return (
        <div className='input-container'>
            <h1>Upload a Route</h1>
            {errorModal.error_name != "" && <ErrorModal errorModal={errorModal} setErrorModal={setErrorModal} />}
            <div className='input-form'>
                
                <div className='input-item'>
                    <label>Route Name </label>
                    <input type ="text" onChange={(e)=>setRouteData({...routeData, route_name: e.target.value})}  />
                </div>
                <div className='input-item'>
                    <label>Route Date</label>
                    <input type ="date" onChange={(e)=>setRouteData({...routeData, route_date: e.target.value})}/>  
                </div>
                <div className='input-item'>
                    <label>Route Time</label>
                    <input type ="time" onChange={(e)=>setRouteData({...routeData, route_time: e.target.value})}/>
                </div>
                <div className='input-item'>
                    <label>Route File (.gpx) (<button onClick={()=>setErrorModal({error_name: "How to get a GPX File", error_desc: "GPS Exchange Format (GPX) is a file format that is used for storing routes of activites in sports such as cycling or running.\nThere are two easy methods for getting a Waaiers compatible GPX file for a route.\nThe first, is required if you have NOT done the route before. If this is the case, you can use an online map planning tool to quickly create the route and then download the GPX file. Platforms such as Strava and Garmin have these built into their online platforms. If you don’t have access to these platforms, I recommend using www.maps.ie/map-my-route/ does not.\nThe second method is by downloading the GPX file from a ridesharing platform such as Strava, Garmin etc… If you have done the route before and uploaded the GPX file. You can navigate to the page for that activity and then download the GPX file from there. This also works for creating wind maps of routes your friends have done as you are also able to download the GPX file of their activity."})}>?</button>)</label>
                    <input type="file" accept='.gpx' onChange={readFile}/>
                </div>
                <button onClick={()=>addRoute()}>View Route</button>
            </div>
        </div> 
  );
}

export default UploadRoute;