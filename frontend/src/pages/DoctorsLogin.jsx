import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const DoctorLogin = () => {
  const { backendUrl, setToken } = useContext(AppContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/login`,
        { email, password }
      )

      if (data.success) {
        localStorage.setItem("doctorToken", data.token)
        setToken(data.token)
        navigate('/doctor/dashboard')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
  console.log(err.response);   // ⭐ VERY IMPORTANT
  console.log(err.message);
  toast.error(err.response?.data?.message || "Login failed");
}

  }

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto p-8 border rounded-xl min-w-[340px]">
        <p className="text-2xl font-semibold">Doctor Login</p>

        <div className="w-full">
          <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            className="border rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
            className="border rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button 
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          Login
        </button>
      </div>
    </form>
  )
}

export default DoctorLogin
