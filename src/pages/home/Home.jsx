import React from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom';
import Testimonial from '../../components/testimonials/Testimonial';

const Home = () => {
    const navigate = useNavigate()
  return (
    <div>
    <div className='home'>
        <div className="home-content">
            <h1>Welcome to EduCloud</h1>
            <p>Learn from anywhere, anytime</p>
            <button onClick={()=>{navigate('/courses')}} className='comman-btn'>Get Started</button>
        </div>
    </div>
    <Testimonial/>
    </div>
  )
}

export default Home;