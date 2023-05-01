import RefreshWeatherData from "./RefreshWeatherData"
const AdminRaceTab = (props) =>{
    
    console.log(props.data)
    return(
        <div style = {{display:"flex"}}>
            <p>{props.data.route_name}</p>
            <button onClick={()=>RefreshWeatherData(props.data)}>Update Weather</button>
        </div>
    )
}
export default AdminRaceTab