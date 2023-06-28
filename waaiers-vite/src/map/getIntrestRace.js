import supabase from "../supabase/supabase";

async function getIntrestRace()
{
    //Get all of the routes that are currently being displayed
    const {data} = await supabase.from('Routes').select('*').eq('route_visible',2);


    //I want the list of upcoming races to be sorted by date so I will split the date format into an array or year / month / day then sort based on this
    {data.map((item,id)=>{
        item.route_date = item.route_date.split('-')

    })}
    data.sort(function (a, b) {   
        return Number(a.route_date[1]) - Number(b.route_date[1]) || Number(a.route_date[2]) - Number(b.route_date[2]);
    });

    console.log(data)
    //Then return the first race out of this array ie one that occurs first
    return data[0].id
}

export default getIntrestRace