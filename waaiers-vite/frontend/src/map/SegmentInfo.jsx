import IntrestSegmentStars from "../segments of intrest/IntrestSegmentStars"
 
const SegmentInfo = (props) =>
{
    const segmentData = props.segmentData
    const avgWindSpeed = segmentData.windSpeed
    const avgWindGust = segmentData.windSpeedGust
    const kmStart = ((segmentData.distanceStart)/1000).toFixed(1)
    const kmEnd = ((segmentData.distanceEnd)/1000).toFixed(1)
    const segmentDifficulty = segmentData.difficulty;

    return(
    <div style = {{color:'#00121c',textAlign:"center"}}>
   
        <h3>{kmStart}km - {kmEnd}km </h3>
        
        <h5 >Wind Speed: {Math.round(avgWindSpeed)}kmph</h5>
        <h5>Wind Gusts: {Math.round(avgWindGust)}kmph</h5>
        <div style={{flexDirection:'row',display:'flex'}}>
            <p style = {{flex:1}}></p>
            <div style = {{backgroundColor:'#00121c',padding:10,borderRadius:10}}>
            <IntrestSegmentStars difficulty = {segmentDifficulty}/>
            </div>
            <p style = {{flex:1}}></p>
        
        </div>
       
        
  </div>
    )
  
}

export default SegmentInfo