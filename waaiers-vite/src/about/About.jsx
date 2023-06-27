import './About.css'
import { useEffect, useState } from "react";
import Faq from "react-faq-component";

const data = {
    rows: [
        {
            title: "How is the segment difficulty calculated?",
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed tempor sem. Aenean vel turpis feugiat,
              ultricies metus at, consequat velit. Curabitur est nibh, varius in tellus nec, mattis pulvinar metus.
              In maximus cursus lorem, nec laoreet velit eleifend vel. Ut aliquet mauris tortor, sed egestas libero interdum vitae.
              Fusce sed commodo purus, at tempus turpis.`,
        },
        {
            title: "Where is the weather data taken from?",
            content:
                "The weather data used in Waaiers is taken from Open Meteo",
        },
        {
            title: "How do I get a GPX file for a route to upload?",
            content: `Curabitur laoreet, mauris vel blandit fringilla, leo elit rhoncus nunc, ac sagittis leo elit vel lorem.
            Fusce tempor lacus ut libero posuere viverra. Nunc velit dolor, tincidunt at varius vel, laoreet vel quam.
            Sed dolor urna, lobortis in arcu auctor, tincidunt mattis ante. Vivamus venenatis ultricies nibh in volutpat.
            Cras eu metus quis leo vestibulum feugiat nec sagittis lacus.Mauris vulputate arcu sed massa euismod dignissim. `,
        },
        {
            title: "Help! My GPX file doesnt work!",
            content: <p>current version is 1.2.1</p>,
        },
        {
            title: "My question isn't listed here, how can I get in contact?",
            content: <p>current version is 1.2.1</p>,
        },
    ],
};

const styles = {
    // bgColor: 'white',
    titleTextColor: "blue",
    //rowTitleColor: "blue",
    // rowContentColor: 'grey',
    // arrowColor: "red",
};

const config = {
    // animate: true,
    // arrowIcon: "V",
    // tabFocus: true
};


const About = () => {
    return(
        <div className='aboutContainer'>
            <h1>Frequently Asked Questions</h1>
            <div>
            <Faq
                data={data}
                styles={styles}
                config={config}
            />
        </div>
        </div>
    )
}

export default About