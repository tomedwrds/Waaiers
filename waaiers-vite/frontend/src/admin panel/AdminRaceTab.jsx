

import refreshWeatherData from "./refreshWeatherData.js"
import toggleRaceDisplay from "./toggleRaceDisplay.js"

const AdminRaceTab = (props) =>{
    
    return(
        <div style = {{display:"flex"}}>
            <p>{props.data.route_name}</p>
            <button onClick={()=>refreshWeatherData(props.data)}>Update Weather</button>
            {/* Each route can ever not appear ie dont display be dispalyed or be in a dispalyed state but is locked */}
            <select defaultValue={props.data.route_visible} onChange={(e)=>{toggleRaceDisplay(props.data,e.target.value)}}>
                <option value={0}>Dont Display</option>
                <option value={1}>Display Locked</option>
                <option value={2}>Display</option>
            </select>
        </div>
    )
}
export default AdminRaceTab