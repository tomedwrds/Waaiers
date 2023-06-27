import UpcomingRaces from '../UpcomingRaces'
import MainMapPage from '../map/MainMapPage'
import './home.css'

const Home = () => 
{
  
    return(
      <div className='container'>
        <div className='titleContainer'>
      
        </div>
        <div className='mainContentContainer'>
          <div className='nextRaceContainer'>
            <h1>Waaiers Race of Intrest</h1>
          <MainMapPage/>
          </div>
          <div className='upcomingRacesContainer'>
            <UpcomingRaces/>
          </div>
        </div>
      </div>
    )
}

export default Home