import React from 'react'
import { MdSpaceDashboard } from "react-icons/md";
import "./account.css"
import { FiLogOut } from "react-icons/fi";
import { UserData } from '../../context/UserContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Account = ({user}) => {
    const {setIsAuth , setUser} = UserData();
    const navigate = useNavigate();
    const logoutHandler = ()=>{
        localStorage.clear();
        setUser([]);
        setIsAuth(false);
        toast.success("Logged out");
    }
  return (
    <div>
    {user &&(
        <div className="profile">
        <h1>My Profile</h1>
        <div className="profile-info">
            <p>
                <strong>
                    Name- {user.name}
                </strong>
            </p>
            <p>
                <strong>
                    Email - {user.email}
                </strong>
            </p>
            <button  onClick={()=>navigate(`/${user._id}/dashboard`)} className='"comman-btn'>< MdSpaceDashboard/>Dashboard</button>

            <br/>
            {
                user.role ==="admin" && (
                    <button  onClick={()=>navigate(`/admin/dashboard`)} className='"comman-btn'>< MdSpaceDashboard/>Admin Dashboard</button>
               
                )

            }
            <br/>
            <button className='"comman-btn' onClick={logoutHandler} style={{background:"red"}}><FiLogOut/>Logout</button>
        </div>
    </div>
    )}
    </div>
  )
}

export default Account