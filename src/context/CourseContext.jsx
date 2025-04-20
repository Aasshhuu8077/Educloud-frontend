import axios from 'axios';
import React, { useEffect } from 'react'
import { createContext , useContext,useState} from 'react'
import { server } from '../main';


const CourseContext = createContext();

export const CourseContextProvider = ({children})=>{
    const [courses , setCourses] = useState([]);
    const [course , setCourse] = useState({});
    const [mycourse , setMycourse] = useState({});

    async function fetchCourses(){
        try{
            const {data} = await axios.get('http://localhost:8120/api/course/all')
            setCourses(data.courses)
        }
        catch(error){
            console.log(error);
        }
    }
   
    async function fetchCourse(id) {
        try{
            const {data} = await axios.get(`${server}/api/course/${id}`);
            setCourse(data.course)
        }
        catch(error){
            console.log(error);
        }
        
    }

    async function fetchMycourse(params) {
        try{
             const {data} = await axios.get(`${server}/api/mycourse`,{
                headers:{
                    token: localStorage.getItem("token")
                }
             })

             setMycourse(data.courses)
        }


        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchCourses()
        fetchCourse()
    },[]);
    return <CourseContext.Provider value={{courses,fetchCourses,fetchCourse , course , mycourse , fetchMycourse}}>{children}</CourseContext.Provider>

};
  

export  const CourseData = () => useContext(CourseContext)