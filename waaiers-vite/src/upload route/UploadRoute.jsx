
import { useEffect, useState } from 'react';
import getUserAccessStatus from './getUserData';
import addRoute from './addRoute';
import { Link, useNavigate } from "react-router-dom";
import './UploadRoute.css'
import GPXUploadFailModal from './GPXUploadFailModal';
import GPXInfoModal from './GPXInfoModal';




//Helper function that checks if GPX file is in valid format or not
async function addRouteHelper(routeData,routeGpxData,userAdmin,navigate,setDisplayErrorModal)
{
    //Before adding route we want to check if the date given is to far away. If its to far away no weather data exists causing an error. Therefore we want to check that its not more than 2 weeks ahead.
    //User may not have defined date in that case check later on catches this
    if(routeData.route_date != null)
    {
        const current_date = new Date()
        const route_date =  new Date(routeData.route_date) 

        //Get time gives time in ms we can convert this diffrence to days
        const daysBetween = (route_date.getTime() - current_date.getTime()) / (1000 * 3600 * 24);
        if(daysBetween > 14)
        {
            alert('Date given is to far away. Date must be withn two weeks of current date.')
        }
        else
        {
            try{
                await addRoute(routeData,routeGpxData,userAdmin,navigate)
            }
            catch(err) {
                console.log(err)
                setDisplayErrorModal(true)
            }
        }
    }
    
}


function UploadRoute() 
{
    //GET USER ACCESS STATUS
    //Certain features when uploading gpx files require admin status. on page load the page checks wether the user has admin status and then conditionally renders contet based on this
    const[userAdmin,setUserAdmin] = useState(false)
    useEffect(()=>{
        //Determines the user access status and wether there the admin
        getUserAccessStatus(setUserAdmin);
    },[])


    //HANDLE THE FILE DATA

    //File stores the pre-parsed gpx file (what the user has uploaded) and then route gpxRouteData handles the parsed data
    const [file, setFile] = useState(null);
    const [routeGpxData, setRouteGPXData] = useState(null);

    const changeHandler = (e) => {
        const file = e.target.files[0];
        //Reading the file is a sideffect so it should be handled in a useEffect
        //This can be done by updating file which a depdendecy of the useffect below
        setFile(file);
    }
  
    useEffect(()=> {
        //Checks that file is set as useEffect runs on first render
        if (file) 
        {
            //Read the file
            const fileReader = new FileReader();
            fileReader.readAsText(file);

            //Wait till the read is finished
            fileReader.onload = (e) => {
                const { result } = e.target;
                setRouteGPXData(result)
            }
            
      }
    },[file])

    //NAVIGATION
    const navigate = useNavigate();

    //An empty route data object is defined that is immutability updated to add all propeties of the route
    //This object is in the format of that required for the insert of route query
    const[routeData,setRouteData] = useState({route_name:null,route_date:null,route_time:null})
     
    //Display error modal hooks
    const [displayErrorModal,setDisplayErrorModal] = useState(false);

    //Display gpx info modal hooks
    const [displayGPXInfo,setDisplaGPXInfo] = useState(false);
   
    return (
        <div className='input-container'>
            <h1>Upload a Route</h1>
            {displayErrorModal && <GPXUploadFailModal setOpenModal={setDisplayErrorModal} />}
            {displayGPXInfo && <GPXInfoModal setOpenModal={setDisplaGPXInfo} />}
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
                    <label>Route File (.gpx) (<button onClick={()=>setDisplaGPXInfo(true)}>?</button>)</label>
                    <input type="file" accept='.gpx' onChange={changeHandler}/>
                </div>
                <button onClick={()=>addRouteHelper(routeData,routeGpxData,userAdmin,navigate,setDisplayErrorModal)}>View Route</button>
               
              
            </div>
        </div> 
  );
}

export default UploadRoute;