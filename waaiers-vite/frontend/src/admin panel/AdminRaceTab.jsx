const AdminRaceTab = (props) =>{
    async function updateWeatherData() {
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

    async function toggleWeatherDisplay(val) {
        try {   
            const resp = await fetch("https://localhost:7276/api/Route/Update/Display/", {
                method: "POST",
                body: JSON.stringify({
                    id: props.data.id,
                    displayStatus: val
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

    async function deleteRoute() {
        try {   
            const resp = await fetch("https://localhost:7276/api/Route/" + props.data.id, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include"
            
            });
            if(resp.ok) {
                window.location.reload(false)
            }
        } catch(e) {
            console.error(e)
        }
    }
    return(
        <div style = {{display:"flex"}}>
            <p>{props.data.routeName}</p>
            <button onClick={()=>updateWeatherData()}>Update Weather</button>
            <select defaultValue={props.data.displayed} onChange={(e)=>{toggleWeatherDisplay(e.target.value)}}>
                <option value={0}>Dont Display</option>
                <option value={1}>Display Locked</option>
                <option value={2}>Display</option>
            </select>
            <button onClick={()=>deleteRoute()}>Delete Route</button>
        </div>
    )
}
export default AdminRaceTab