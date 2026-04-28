import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const { backendUrl, token, setToken } = useContext(AppContext)

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [userId, setUserId] = useState('')

  const [forgotStep, setForgotStep] = useState(false)
  const [resetOtp, setResetOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {

    event.preventDefault()

    try {

      if (state === 'Sign Up') {

        const { data } = await axios.post(
          backendUrl + '/api/user/register',
          { name, email, password, phone }
        )

        if (data.success) {
          toast.success("Account created successfully")
          setState('Login')
        } else {
          toast.error(data.message)
        }

      }

      else {

        if (!otpStep) {

          const { data } = await axios.post(
            backendUrl + '/api/user/login',
            { email, password }
          )

          if (data.success) {
            toast.success("OTP sent to your email")
            setUserId(data.userId)
            setOtpStep(true)
          }
          else {
            toast.error(data.message)
          }

        }

        else {

          const { data } = await axios.post(
            backendUrl + '/api/user/verify-otp',
            { userId, otp }
          )

          if (data.success) {

            localStorage.setItem('token', data.token)
            setToken(data.token)

          } else {
            toast.error(data.message)
          }

        }

      }

    } catch (error) {

      toast.error(error.message)

    }

  }

  // RESEND OTP
  const handleResendOtp = async () => {

    try {

      const { data } = await axios.post(
        backendUrl + '/api/user/login',
        { email, password }
      )

      if (data.success) {
        toast.success("New OTP sent to your email")
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  // SEND RESET OTP
  const sendResetOtp = async () => {

    try {

      const { data } = await axios.post(
        backendUrl + "/api/user/forgot-password",
        { email }
      )

      if (data.success) {
        toast.success("OTP sent to email")
        setUserId(data.userId)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  // RESET PASSWORD
  const resetPassword = async () => {

    try {

      const { data } = await axios.post(
        backendUrl + "/api/user/reset-password",
        { userId, newPassword }
      )

      if (data.success) {
        toast.success("Password reset successful")
        setForgotStep(false)
        setState('Login')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {

    if (token) {
      navigate('/')
    }

  }, [token])

  return (

    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>

      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>

        <p className='text-2xl font-semibold'>
          {forgotStep ? "Reset Password"
            : state === 'Sign Up' ? 'Create Account'
            : otpStep ? 'Enter OTP'
            : 'Login'}
        </p>

        {/* FORGOT PASSWORD SCREEN */}

        {forgotStep && (

          <>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className='border rounded w-full p-2'
            />

            <button
              type="button"
              onClick={sendResetOtp}
              className='bg-primary text-white py-2 rounded'
            >
              Send OTP
            </button>

            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={resetOtp}
              onChange={(e)=>setResetOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
              className='border rounded w-full p-2'
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
              className='border rounded w-full p-2'
            />

            <button
              type="button"
              onClick={resetPassword}
              className='bg-green-600 text-white py-2 rounded'
            >
              Reset Password
            </button>
          </>

        )}

        {!forgotStep && (

          <>
            {state === 'Sign Up' &&
              <div className='w-full'>
                <p>Full Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className='border rounded w-full p-2 mt-1'
                  type="text"
                  required
                />
              </div>
            }

            {!otpStep &&
              <>
                <div className='w-full'>
                  <p>Email</p>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className='border rounded w-full p-2 mt-1'
                    type="email"
                    required
                  />
                </div>

                {state === 'Sign Up' &&
                  <div className='w-full'>
                    <p>Phone</p>
                    <input
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                      value={phone}
                      className='border rounded w-full p-2 mt-1'
                      type="tel"
                      maxLength="10"
                      required
                    />
                  </div>
                }

                <div className='w-full'>
                  <p>Password</p>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className='border rounded w-full p-2 mt-1'
                    type="password"
                    required
                  />
                </div>

                {state === 'Login' &&
                  <p
                    onClick={()=>setForgotStep(true)}
                    className="text-primary underline cursor-pointer text-sm"
                  >
                    Forgot Password?
                  </p>
                }
              </>
            }

            {otpStep &&
              <>
                <input
                  type="text"
                  maxLength="6"
                  onChange={(e)=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                  value={otp}
                  className='border rounded w-full p-2 mt-1'
                />

                <p
                  onClick={handleResendOtp}
                  className="text-primary cursor-pointer text-sm underline"
                >
                  Resend OTP
                </p>
              </>
            }

            <button
              type='submit'
              className='bg-primary text-white w-full py-2 my-2 rounded-md'
            >
              {state === 'Sign Up'
                ? 'Create account'
                : otpStep
                ? 'Verify OTP'
                : 'Login'}
            </button>

            {!otpStep && (
              state === 'Sign Up'
                ? <p>
                    Already have an account?
                    <span
                      onClick={() => setState('Login')}
                      className='text-primary underline cursor-pointer'>
                      Login here
                    </span>
                  </p>
                : <p>
                    Create a new account?
                    <span
                      onClick={() => setState('Sign Up')}
                      className='text-primary underline cursor-pointer'>
                      Click here
                    </span>
                  </p>
            )}

          </>
        )}

      </div>

    </form>

  )
}

export default Login