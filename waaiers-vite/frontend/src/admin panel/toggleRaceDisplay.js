
import supabase from "../supabase/supabase";

//This function handles functionality in the admin pannel for toggling wether to display a race
async function toggleRaceDisplay(route_data,new_state)
{
    const route_id = route_data.id;

    //Set the route to have its value be the new state
    const toggleQuery = await supabase.from('Routes').update({route_visible: new_state}).eq('id',route_id);
   
}

export default (toggleRaceDisplay)