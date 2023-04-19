import supabase from "./supabase/supabase"

const Login = ()=>
{
    async function googleLogin()
    {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        })
    }
    return(
        <button onClick={()=>googleLogin()}>login</button>
    )
}
export default Login