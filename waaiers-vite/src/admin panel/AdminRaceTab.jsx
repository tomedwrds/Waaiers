

import refreshWeatherData from "./refreshWeatherData.js"
import toggleRaceDisplay from "./toggleRaceDisplay.js"
const AdminRaceTab = (props) =>{
    
    return(
        <div style = {{display:"flex"}}>
            <p>{props.data.route_name}</p>
            <button onClick={()=>refreshWeatherData(props.data)}>Update Weather</button>
            <button onClick={()=>toggleRaceDisplay(props.data)}>Toggle Race</button>
        </div>
    )
}
export default AdminRaceTab