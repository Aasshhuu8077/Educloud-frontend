import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { server } from "../main";
import toast, {Toaster} from 'react-hot-toast'
const  UserContext = createContext();

export const UserContextProvider = ({children})=>{
   const [user,setUser]= useState([]);
   const [isAuth, setIsAuth] = useState(false);
   const [btnloading, setBtnloading] = useState(false);
   const [loading, setloading] = useState(true);
    async function loginUser(email,password,navigate , fetchMyCourse){
        setBtnloading(true);
        try{
      const {data} = await axios.post('http://localhost:8120/api/user/login',
        
        {
            email,
            password
        });
        console.log(data)
      toast.success(data.message)
      localStorage.setItem("token",data.token)
      setUser(data.user);
      setIsAuth(true);
      setBtnloading(false);
      navigate("/");
      fetchMyCourse();
        }
        catch(error){
            setBtnloading(false);
            setIsAuth(false);
            toast.error(error.response.data.message);

        }
    }

    async function RegisterUser(name,email,password,navigate){
        setBtnloading(true);
        try{
      const {data} = await axios.post(`${server}/api/user/register`,
        
        {
            name,
            email,
            password
        });
        console.log(data)
      toast.success(data.message)
      localStorage.setItem("token",data.token)
      
      setBtnloading(false);
      navigate("/verify");
        }
        catch(error){
            setBtnloading(false);
            setIsAuth(false);
            toast.error(error.response.data.message);

        }
    }

async function verifyOtp(otp,navigate){
    setBtnloading(true);
   
    const token = localStorage.getItem("token");
     try{
        const {data} = await axios.post(`${server}/api/user/verify`,
        
            {
                otp,
                token
            });
            console.log(data)
          toast.success(data.message)
          navigate('/login')
          localStorage.clear();
          setBtnloading(false);

     }
     catch(err){
        
        toast.error(err.response.data.message);
         

     }
}

        async function fetchUser() {
            try{
          const {data} = await axios.get(`${server}/api/user/me`,{
            headers: {
                token:localStorage.getItem("token")
          }
        });

        setIsAuth(true);
        setUser(data.user);
        setloading(false)
            }
            catch(error){
               console.log(error)
               setloading(false)
            }
            
        }
    

    useEffect(()=>{
        fetchUser()
    },[])
    return <UserContext.Provider value={{user,setUser,setIsAuth,isAuth,loginUser,btnloading,loading,RegisterUser , verifyOtp,fetchUser}}>
        {children}
        <Toaster/>
    </UserContext.Provider>
}


export const UserData = () => useContext(UserContext)