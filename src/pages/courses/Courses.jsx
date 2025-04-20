import React from 'react'
import './courses.css'
import { CourseData } from '../../context/CourseContext';
import Coursecard from '../../components/coursecard/Coursecard';

const Courses = () => {
    const {courses} = CourseData();
    console.log("hello")
    console.log(courses);
  return (
    <div className="courses">
      <h2>Availaible courses</h2>
      <div className="course-container">
        {courses && courses.length > 0 ? (
                 courses.map((e) => <Coursecard key={e._id} course={e} />)
               ) : (
                 <p>No Courses Yet!</p>
               )}
      </div>
    </div>
  )
}

export default Courses