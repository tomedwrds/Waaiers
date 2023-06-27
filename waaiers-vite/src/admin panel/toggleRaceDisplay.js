
import supabase from "../supabase/supabase";

//This function handles functionality in the admin pannel for toggling wether to display a race
async function toggleRaceDisplay(route_data)
{
    const route_id = route_data.id;

    //First get the state of display
    const displayState = await supabase.from('Routes').select('route_visible').eq('id',route_id);
  
    //Query then to update the state to the negation of its current
    const toggleQuery = await supabase.from('Routes').update({route_visible:  !displayState.data[0].route_visible}).eq('id',route_id);
   
}

export default (toggleRaceDisplay)