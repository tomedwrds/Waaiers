import supabase from '../supabase/supabase';

async function getUserAccessStatus(setUserAdmin)
{
    //Supabase stores user auth data in a restricted table, the profile table i made allows user specific data to be stored ie admin status
    //Get the user uuid from the auth table, then get the admin status of the assoicated uuid in the user table
    const { data: { user },error } = await supabase.auth.getUser()

    //If the user is not logged in an error will be thrown we want to return
    if(error)
    {
        return;
    }
    const {data} = await supabase.from('Users').select('user_admin').eq('id', user.id)

    setUserAdmin(data[0].user_admin);
}

export default getUserAccessStatus