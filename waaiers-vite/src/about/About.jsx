import './About.css'
import { useEffect, useState } from "react";
import Faq from "react-faq-component";
import { useLocation } from 'react-router-dom';

const modelFAQ = {
    title: 'Wind Analysis Model FAQ',
    rows: [
        {
            title: "How is the segment difficulty calculated?",
            content:
                <div>
                    <p>The calculation of segment difficulty is a threestep process. The first is determining whether a segment meets certain thresholds to determine whether we should care about the segment. Note that the ‘golden angle’ is the value in which the impact of the wind is strongest. For head winds and tail winds, it is the angle in which wind blows straight into or behind the rider respectively. For cross winds its impact is greatest when the wind is a cross tail wind and therefore the ‘golden angle’ is 75 degrees each side from behind the rider. The thresholds are as follows:</p>
                    <ul>
                        <li>Wind Speed {`>`} 10kmph</li>
                        <li>Degrees from golden angle {`<`} 30°</li>
                        <li>Segment length {`>`} 1000m</li>
                    </ul>
                    <p>If a segment meets these thresholds the second step of the difficulty classification algorithm is carried out. This second step determines how many stars a segment is. The allocation of stars to factors is as follows:</p>
                    <ul>
                        <li>Wind Speed 1.5 stars</li>
                        <li>Wind direction 1 star</li>
                        <li>Segment length 0.5 stars</li>
                    </ul>
                    <p>The extra weighting towards wind speed is that is often the determinant factor in how much wind impacts a race. Wind direction is also weighted accordingly as the direction of wind is very important when it comes to the formation of cross winds.</p>
                    <p>How much of each of these stars that are given to a segment for each factor is determined by how close a segments value is to the max values for that factor ie a segment that is 5km long will get 0.25 stars for segment length whilst a 10km long segment would get 0.5 stars. The max values for each factor are as follows.</p>
                    <ul>
                        <li>Wind Speed 30kmph</li>
                        <li>Defrees from golden angle 0°</li>
                        <li>Segment length 10km</li>
                    </ul>
                    <p>The stars awarded for each factor are then summed to get a total value. This value is then rounded to the nearest 0.5 and then the final step is carried out of maxing the value. </p>
                    <p>This third step takes into account that head winds have very little bearing on a race whereas tailwinds have a slight impact, but cross winds are the most devestating. To reflect this a max star value is placed on each segment based on its wind direction. These max values ensure that the segments with the most stars will have the largest impact on the race. These max values are as follows.</p>
                    <ul>
                        <li>Cross wind 3 stars</li>
                        <li>Tail wind 1.5 stars</li>
                        <li>Head wind 1 star</li>
                    </ul>
                </div>,
        },
        {
            title: "Are there any limitations to the model?",
            content:`There exists one major limitation to the Waaiers model. This limitation is that Waaiers assumes there exists no windbreaks alongside the edge of the road. These windbreaks could be for example hedges, buildings, or trees. These windbreaks could cause the strength of the wind a rider faces on a road to be less than that given by Waaiers. At this point in time their exists no way to account for this in our model as there exists no datasets on windbreaks alongside roads. 

            `,
        },

        {
            title: "Where is the weather data taken from?",
            content:
                "The weather data used in Waaiers is taken from Open Meteo. Open Meteo was used as it has access to highly reliable weather data world wide and is free to use.",
        },
        {
            title: "In simple terms how does Waaiers work?",
            content:
                "The process begins by a GPX file being uploaded. This GPX file consists of GPS points. A set of these GPS points – that are evenly distributed throughout the stages profile – are taken and sent to a weather API (in this case Open Meteo). Also sent to the weather API is the date and time of the race. The API then returns the wind data at that point at the given time. This data is then put through the Waaiers model (as described above) to generate the data for a stage. The data outputted from the model is then formatted to be rendered onto the interactive map and stage profile.",
        },
        {
            title: "Is the weather data historic or based on upcoming weather forecasts?",
            content:
               <div>
                <p>The data is based on upcoming weather forecasts. This approach was used as opposed to making use of historic models as it allows Waaiers to pick up certain weather events that aren’t normal ie very strong wind. </p>
                <p>In the cases of pro races that Waaiers curates the weather data is updated every 12 hours to get the latest weather forecasting for the day of the race. On the day of the race these weather updates are done every hour.</p>
               </div>,

        },
       
        
    ],
};


const gpxFAQ = {
    title: 'Common Issues FAQ',
    rows: [
        {
            title: "What is a GPX file and how do I get a GPX file for a route to upload?",
            content:
                <div>
                    <p>GPS Exchange Format (GPX) is a file format that is used for storing routes of activites in sports such as cycling or running.</p>
                    <p>There are two easy methods for getting a Waaiers compatible GPX file for a route.</p>
                    <p>The first, is required if you have NOT done the route before. If this is the case, you can use an online map planning tool to quickly create the route and then download the GPX file. Platforms such as Strava and Garmin have these built into their online platforms. If you don’t have access to these platforms, I recommend using <a href={'https://www.maps.ie/map-my-route/'}>www.maps.ie/map-my-route/</a> as opposed to any random tool you find online as some planning tools require you to sign up to download the GPX file whilst <a href={'https://www.maps.ie/map-my-route/'}>www.maps.ie/map-my-route/</a> does not.</p>
                    <p>The second method is by downloading the GPX file from a ridesharing platform such as Strava, Garmin etc… If you have done the route before and uploaded the GPX file. You can navigate to the page for that activity and then download the GPX file from there. This also works for creating wind maps of routes your friends have done as you are also able to download the GPX file of their activity. </p>
                </div> ,
        },
        {
            title: "Help! My GPX file doesnt work!",
            content: 'The GPX file you are using likely lacks required information for Waaiers to run. This is an unfortunate consequence of how data is stored in GPX not being standardized, resulting in some GPX files not having crucial information such as elevation data. Unfortunately, there is no way to fix your file and you’ll instead have to get a new GPX file for the route that is compatible. This can be done in less than a minute by following the information provided in the FAQ section ‘How do I get a GPX file for a route to upload?’.',
        },
        {
            title: "I sent a link of a Waaiers wind map to a friend that I had uploaded, and they were unable to load it, why did this happen?",
            content: 'At this point of time due to operating cost restrictions it is not possible to share a link of a wind map you created to a friend. This is because each wind map requires the storage of hundreds of gpx points, which cost to store in a database. However, an easy work around to this is to send your friend the gpx file you used, and they would be able to upload it themselves and obtain an identical Waaiers wind map as yours for them to view.',
        },
       
    ],
};

const otherFaq = {
    title: 'Other FAQ',
    rows: [
        {
            title: "My question isn't listed here, how can I get in contact?",
            content: 'The best way to contact me is through my email in the pages footer.',
        },
    ]
}




const styles = {
    rowTitleColor: "#00121c",
    rowContentColor: '#00121c',
    arrowColor: "#00121c",
    titleTextSize: '22px'
};




const About = () => {

    return(
        <div className='aboutContainer'>
            <h1>Frequently Asked Questions</h1>
            <div>
            <Faq
                data={modelFAQ}
                styles={styles}
            />
            <Faq
                data={gpxFAQ}
                styles={styles}
              
            />
            <Faq
                data={otherFaq}
                styles={styles}
              
                
            />
        </div>
        </div>
    )
}

export default About