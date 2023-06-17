import IntrestSegment from "./IntrestSegment"
import './IntrestSegment.css';

const IntrestSegmentContainer = (props) =>
{
    // Checks if there is any segments to dispaly and if so maps each one to the intrest segment compoennt 
    if(props.data != null)
    {
      
        let segments = props.data;
        //Sort the segmetns by difficulty if user selects it, otherwise sort by start point
        if(props.sortOrder == "stars")
        {
            segments.sort(function(a, b) {
                return a.segmentDifficulty - b.segmentDifficulty;
            }).reverse();
        }
        else
        {
            segments.sort(function(a, b) {
                return a.kmEnd - b.kmEnd;
            });
        }
        
        return(
            <div  className='intrestSegmentContainer'>
                
                {segments.map((item,id)=> {
                    if(item.classification == props.windDirection )
                    {
                        return(
                            <IntrestSegment key = {id} data = {item}/>
                    )
                    }
            }
        )}</div>)
        
    }
}

export default IntrestSegmentContainer