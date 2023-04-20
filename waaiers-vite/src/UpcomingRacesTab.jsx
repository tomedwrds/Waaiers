import supabase from "./supabase/supabase";

const UpcomingRacesTab = (props)=>
{
    const routeData = props.routeData;

    
    async function getRoutePointData(i)
    {
        const {data} = await supabase.rpc('get_points_weather').range(((i)*100),((i+1)*100)-1)
        return data;
    }
        
   

    async function loadRoutePointData()
    {
        let routePointData = []
        do{
            routePointData.push(await (getRoutePointData(Math.floor(routePointData.length/100))))
        } while(routePointData.length % 100 != 0)

        console.log(routePointData)
    }


    return(
        <div style={{display: 'flex',margin:20}}>
            <p>Race: {routeData.route_name}</p>
            <button onClick={()=>loadRoutePointData()}>Load</button>

        </div>
    )
}
export default UpcomingRacesTab


