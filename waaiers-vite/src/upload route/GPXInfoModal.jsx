import "./GPXInfoModal.css";

const GPXInfoModal = ({ setOpenModal }) => {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className ="modalTitleClose">
            <div className="title">
                <h1>How to get a GPX File</h1>
            </div>
            <div className="titleCloseBtn">
                <button
                    onClick={() => {
                    setOpenModal(false);
                    }}
                >
                    X
                </button>
            </div>
        </div>
        <div className="body">
            <p>GPS Exchange Format (GPX) is a file format that is used for storing routes of activites in sports such as cycling or running.</p>
            <p>There are two easy methods for getting a Waaiers compatible GPX file for a route.</p>
            <p>The first, is required if you have NOT done the route before. If this is the case, you can use an online map planning tool to quickly create the route and then download the GPX file. Platforms such as Strava and Garmin have these built into their online platforms. If you don’t have access to these platforms, I recommend using <a href={'https://www.maps.ie/map-my-route/'}>www.maps.ie/map-my-route/</a> as opposed to any random tool you find online as some planning tools require you to sign up to download the GPX file whilst <a href={'https://www.maps.ie/map-my-route/'}>www.maps.ie/map-my-route/</a> does not.</p>
            <p>The second method is by downloading the GPX file from a ridesharing platform such as Strava, Garmin etc… If you have done the route before and uploaded the GPX file. You can navigate to the page for that activity and then download the GPX file from there. This also works for creating wind maps of routes your friends have done as you are also able to download the GPX file of their activity. </p>
        </div>
       
      </div>
    </div>
  );
}

export default GPXInfoModal;
