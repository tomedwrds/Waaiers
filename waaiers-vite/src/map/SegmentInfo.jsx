import average from "../generalpurposefunctions/average"
import IntrestSegmentStars from "../segments of intrest/IntrestSegmentStars"
 
const SegmentInfo = (props) =>
{
    const segmentData = props.segmentData
    const avgWindSpeed = average(segmentData.segmentWindSpeed)
    const avgWindGust = average(segmentData.segmentWindGust)
    const avgWindDir = average(segmentData.segmentWindAngle)
    const kmStart = ((segmentData.kmStart)/1000).toFixed(1)
    const kmEnd = ((segmentData.kmEnd)/1000).toFixed(1)
    const segmentDifficulty = segmentData.segmentDifficulty;

    return(
    <div style = {{backgroundColor: '#00121c',color:'white'}}>
   
     
        <IntrestSegmentStars difficulty = {segmentDifficulty}/>
        <p>{kmStart}km - {kmEnd}km </p>
        <p className ="intrestSegment-header-windspeed">Wind Speed: {Math.round(avgWindSpeed*100)/100}kmph</p>
        <p>Wind Gusts: {Math.round(avgWindGust)}kmph</p>
  </div>
    )
  
}

export default SegmentInfo