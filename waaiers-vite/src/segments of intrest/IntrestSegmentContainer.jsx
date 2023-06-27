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
        
        if(segments.length != 0)
        {
            return(
                <div  className='intrestSegmentContainer'>
                    
                    {segments.map((item,id)=> {
                        if(item.classification == props.windDirection || props.windDirection == 'all')
                        {
                            return(
                                <IntrestSegment key = {id} data = {item}/>
                        )
                        }
                }
            )}</div>)
        }
        else
        {
            return(
                <div style={{marginTop:'120px',marginBottom:'120px'}}>  
                    <h2 style={{marginBottom:'0px'}}> The Wind is Calm </h2>
                    <p style={{marginTop:'5px',color:'grey'}}>No {(props.windDirection != 'all' ? props.windDirection:'') }wind segments of intrest for this race</p>
                </div>
            )
        }
        
    }
}

export default IntrestSegmentContainer