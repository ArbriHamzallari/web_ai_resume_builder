import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import Pricing from './pages/Pricing'
import Checkout from './pages/Checkout'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import {Toaster} from 'react-hot-toast'

const App = () => {

  const dispatch = useDispatch()

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      // Try to get user data - cookies will be sent automatically with withCredentials
      const { data } = await api.get('/api/users/data', token ? {headers: {Authorization: token}} : {})
      if(data.user){
        // Update token if provided (for backward compatibility)
        const authToken = token || data.token
        if(authToken) {
          localStorage.setItem('token', authToken)
        }
        dispatch(login({token: authToken, user: data.user}))
      }
      dispatch(setLoading(false))
    } catch (error) {
      // If unauthorized, clear invalid token
      if(error.response?.status === 401) {
        localStorage.removeItem('token')
      }
      dispatch(setLoading(false))
      // Don't log error if no token (user not logged in)
      if(token) {
        console.log('Auth check failed:', error.message)
      }
    }
  }

  useEffect(()=>{
    getUserData()
  },[])

  return (
    <>
    <Toaster />
      <Routes>
        <Route path='/' element={<Home />}/>

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />}/>
          <Route path='builder/:resumeId' element={<ResumeBuilder />}/>
          <Route path='pricing' element={<Pricing />}/>
          <Route path='checkout' element={<Checkout />}/>
        </Route>

        <Route path='view/:resumeId' element={<Preview />}/>

      </Routes>
    </>
  )
}

export default App
