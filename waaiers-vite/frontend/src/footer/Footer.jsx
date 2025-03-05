import './Footer.css'

function Coffee() {
    return (
    <a
      className="buyButton"
      target="_blank"
      href="https://www.buymeacoffee.com/tomedwards"
    >
      <img
        className="coffeeImage"
        src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
        alt="Buy me a coffee"
      />
      <span className="coffeeButtonText">Buy me a coffee</span>
    </a>
     );
    }
const Footer = () => {
    return(
        <div className="footerContainer">
            <div className="footerCopyRight">
                <p className="footerText">© 2023 Tom Edwards Development NZ</p>
               
            </div>
            <div className='footerLinks'>
            
                <a href="https://github.com/tomedwrds/Waaiers"><p className="footerIcon"><i className="fa-brands fa-github"></i></p></a>
                <a href="mailto:tomedwardsdevelopmentnz@gmail.com"><p className="footerIcon"><i className="fa-solid fa-envelope"></i></p></a>
                <Coffee/>


            </div>
            
            
        </div>
    )
}

export default Footer