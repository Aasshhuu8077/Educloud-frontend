import React from 'react'
import './coursecard.css'
import { server } from '../../main'
import { UserData } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CourseData } from '../../context/CourseContext'
import axios from 'axios'

const Coursecard = ({course}) => {
    const navigate = useNavigate();
    const{user , isAuth} = UserData();
    const { image, title, createdBy, duration, price } = course;
    const {fetchCourses} = CourseData()
    const deletehandler = async(id)=>{
    if(confirm("Are you sure you want to delete this course?")){
        try{
            const {data} = await axios.delete(`${server}/api/course/${id}` , {
                headers:{
                    token : localStorage.getItem("token")
                }
            })
            toast.success(data.message);
            fetchCourses();

        }
        catch(error){
            toast.error(error.response.data.message)

        }
    }
    }
  return (
   <div className="course-card">
    <img src={`${server}/${image}`} alt=""  className='course-image'/>
    <h3>{title}</h3>
    <p>Instructor-{createdBy}</p>
    <p>Duration-{duration} Weeks</p>
    <p>Price-₹{price}</p>
    
    {
        isAuth ? (
           <>
           {user && user.role !== "admin"?  <>
           {
            user.subscription.includes(course._id) ? (
                <button className="course-btn" onClick={() => navigate(`/course/study/${course._id}`)}>Study</button>
            ):(
                <button onClick={()=>navigate(`/course/${course._id}`)} className='common-btn'>Get Started</button>
            )
           }
           </> :
           <button onClick={()=>navigate(`/course/study/${course._id}`)} className='common-btn'>Study</button>}
            
           </>
            
        ):(
            <button onClick={()=>navigate("/login")} className='common-btn'>Get Started</button>
        )
    }
     <br/>

    {
        user && user.role === "admin" && (
            <button onClick={()=>deletehandler(course._id)} className='comman-btn' style={{background:"red"}}>Delete</button>
        )
    }
   
    
   </div>
  )
}

export default Coursecard