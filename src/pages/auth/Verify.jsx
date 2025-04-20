import React from 'react'
import './auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { UserData } from '../../context/UserContext'

const Verify = () => {
 const[otp,setOtp] =  useState("");
 const {btnloading , verifyOtp} = UserData();
 const navigate = useNavigate();
 const submitHandler = async(e)=>{
  e.preventDefault();
  await verifyOtp(Number(otp),navigate);
  console.log(otp)
 }

  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Verify Your Account</h2>
            <form onSubmit={submitHandler}>
                <label htmlFor="otp">Please enter OTP</label>
                <input type="number" value={otp} onChange={e=>setOtp(e.target.value)} required />
                <button className='common-btn' disabled={btnloading} type='submir'>
                  {btnloading?"Please wait...":"Verify"}
                </button>
            </form>
            <p>
                Go to <Link to='/login'>Login Page</Link>
            </p>
        </div>
    </div>
  )
}

export default Verify