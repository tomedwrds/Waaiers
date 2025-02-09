import "./ErrorModal.css";

const ErrorModal = ({ errorModal, setErrorModal }) => {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className ="modalTitleClose">
            <div className="title">
                <h1>{errorModal.error_name}</h1>
            </div>
            <div className="titleCloseBtn">
                <button
                    onClick={() => {
                      setErrorModal({error_name: "", error_desc: ""});
                    }}
                >
                    X
                </button>
            </div>
        </div>
       


        <div className="body">
          <p>{errorModal.error_desc}</p>
        </div>
       
      </div>
    </div>
  );
}

export default ErrorModal;
