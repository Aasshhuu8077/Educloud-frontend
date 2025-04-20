import React from 'react'
import './footer.css'
import { RiFacebookBoxFill } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import { SiInstagram } from "react-icons/si";

const Footer = () => {
  return (
    <footer>
        <div className="footer content">
            <p>
                &copy;2025 Your E-learning Platform. All rights reserved. <br/>
                Made with ❤️ <a href="">Ashutosh</a>
            </p>
            <div className="social-links">
                <a href="https://www.facebook.com/">< RiFacebookBoxFill/></a>
                <a href="https://x.com/?mx=2"><FaXTwitter/></a>
                <a href="https://www.instagram.com/"><SiInstagram/></a>
            </div>
        </div>
    </footer>
  )
}

export default Footer