import './Footer.css'


const Footer = () => {
    return(
        <div className="footerContainer">
            <div className="footerCopyRight">
                <p className="footerText">© 2023 Tom Edwards Development NZ</p>
            </div>
            <div className='footerLinks'>
                <a href="https://github.com/tomedwrds/Waaiers"><p className="footerIcon"><i className="fa-brands fa-github"></i></p></a>
                <a href="mailto:tomedwardsdevelopmentnz@gmail.com"><p className="footerIcon"><i className="fa-solid fa-envelope"></i></p></a>
            </div>
            
            
        </div>
    )
}

export default Footer