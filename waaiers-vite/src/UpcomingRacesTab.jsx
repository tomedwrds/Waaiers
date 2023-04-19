const UpcomingRacesTab = (props)=>
{
    const routeData = props.routeData;
    return(
        <div style={{display: 'flex',margin:20}}>
            <p>Race: {routeData.route_name}</p>
            <button>Load</button>

        </div>
    )
}
export default UpcomingRacesTab


