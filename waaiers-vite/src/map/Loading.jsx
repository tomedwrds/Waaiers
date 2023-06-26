import './Loading.css'
import gif from '../assets/loading.gif'
const Loading = () => {
    return(
        <div className = "loadingBody">
            <div classNAme = "loadingImage">
                <img width={240} src={gif}/>
                <h2 className='loadingText'>Loading...</h2>
            </div>
        </div>
    )
}

export default Loading