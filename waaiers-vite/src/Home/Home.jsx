import './home.css'

const Home = () =>{
    return(
      <div style={{ 
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5),rgba(255,255,255,0.5)),
        url("https://www.siroko.com/blog/c/app/uploads/2021/07/tour-qatar-stage-one-20150208-174321-337.jpg")`,
        height:"100%",
        backgroundRepeat:"no-repeat",
        backgroundPosition:"center",
        width:"100%",
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
      }}>
        <div className ='button-container'>
          <div className='buttons'>
            <p>Upcoming Races</p>
          </div>
          <div className='buttons'>
            <p>Try Yourself</p>
          </div>
        </div>
      </div>
    )
}

export default Home