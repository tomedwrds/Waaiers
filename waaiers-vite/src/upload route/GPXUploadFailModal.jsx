import "./GPXUploadFailModal.css";

const GPXUploadFailModal = ({ setOpenModal }) => {
  return (
    <div className="modalBackground">
      <div className="modalContainerFail">
        <div className ="modalTitleClose">
            <div className="title">
                <h1>GPX File Error</h1>
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
          <p>The GPX file you have provided lacks required information for Waaiers to run. This is an unfortunate consequence of how data is stored in GPX not being standardized. A detailed solution to this can be found on the FAQ page, however an easy work around is to either download the GPX file for a route you have already done off a platform such as Strava or Garmin OR quickly recreate the route on a site that creates GPX data compatible with Waaiers such as <a href={'https://www.maps.ie/map-my-route/'}>www.maps.ie/map-my-route/</a> and save then download the GPX file from that.</p>
        </div>
       
      </div>
    </div>
  );
}

export default GPXUploadFailModal;
