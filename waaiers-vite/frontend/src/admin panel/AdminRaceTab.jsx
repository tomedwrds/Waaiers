

import toggleRaceDisplay from "./toggleRaceDisplay.js"

const AdminRaceTab = (props) =>{
    async function updateWeatherData() {
        console.log(props.data.id)
        try {
                
            const resp = await fetch("https://localhost:7276/api/Route/Update/Weather/", {
                method: "POST",
                body: JSON.stringify({
                    id: props.data.id
                }),
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include"
            });
        } catch(e) {
            console.error(e)
        }
    }
    return(
        <div style = {{display:"flex"}}>
            <p>{props.data.routeName}</p>
            <button onClick={()=>updateWeatherData()}>Update Weather</button>
            <select defaultValue={props.data.route_visible} onChange={(e)=>{toggleRaceDisplay(props.data,e.target.value)}}>
                <option value={0}>Dont Display</option>
                <option value={1}>Display Locked</option>
                <option value={2}>Display</option>
            </select>
        </div>
    )
}
export default AdminRaceTab