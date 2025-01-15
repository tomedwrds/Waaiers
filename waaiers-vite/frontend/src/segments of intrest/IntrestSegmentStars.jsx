import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfStroke} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline} from '@fortawesome/free-regular-svg-icons';
import './IntrestSegment.css';

const IntrestSegmentStars = (props) =>{
    
    //Round to nearest .5
    const stars = Math.round(props.difficulty*2)/2
  
   
    //Returns a star based on difficultiy given. If over 1 give full star, around half give half near empty give none
    function GetStar(props)
    {
        if(stars-props.num >= 1)
        {
            return<FontAwesomeIcon icon={faStar} />;
        }
        if(stars-props.num >= 0.5)
        {
            return<FontAwesomeIcon icon={faStarHalfStroke} />;
        }
        else
        {
            return<FontAwesomeIcon icon={faStarOutline} />;
        }
        
    }
    return(
        <div className='stars'><GetStar num = {0}/><GetStar num = {1}/><GetStar num = {2}/></div>
    )
    
}

export default IntrestSegmentStars;