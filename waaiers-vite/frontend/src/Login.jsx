

const Login = ()=>
{
   

    
    return(
        <div>
        <button onClick={()=>googleLogin()}>login</button>
        <button onClick={()=>getSession()}>session</button>
        <button onClick={()=>signOutUser()}>Sign out</button>
        </div>
    )
}
export default Login