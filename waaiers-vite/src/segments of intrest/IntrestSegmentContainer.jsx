import IntrestSegment from "./IntrestSegment"


const IntrestSegmentContainer = (props) =>
{
    // Checks if there is any segments to dispaly and if so maps each one to the intrest segment compoennt 
    if(props.data != null)
    {
   
        return(
            <div  className='intrestSegmentContainer'>
                {props.data.map((item,id)=> {
                    return(
                        <IntrestSegment key = {id} data = {item}/>
                )
            }
        )}</div>)
        
    }
}

export default IntrestSegmentContainer