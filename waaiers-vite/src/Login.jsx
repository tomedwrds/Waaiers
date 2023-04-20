import supabase from "./supabase/supabase"

const Login = ()=>
{
    async function googleLogin()
    {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        })
        console.log(data);
    }

    async function signOutUser()
    {
        const { data, error } = await supabase.auth.signOut()
    }

    async function getSession()
    {
        const { data, error } = await supabase.auth.getSession();
        console.log(data)
    }

    return(
        <div>
        <button onClick={()=>googleLogin()}>login</button>
        <button onClick={()=>getSession()}>session</button>
        <button onClick={()=>signOutUser()}>Sign out</button>
        </div>
    )
}
export default Login