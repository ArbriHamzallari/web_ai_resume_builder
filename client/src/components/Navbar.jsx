import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'
import { Crown } from 'lucide-react'

const Navbar = () => {

   const {user} = useSelector(state => state.auth)
   const dispatch = useDispatch()

    const navigate = useNavigate()

    // Temporary debug indicator for admin override (development only)
    const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development'
    const isAdmin = () => {
      if (!user?.email) return false
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
      if (!adminEmail) return false
      return user.email.toLowerCase().trim() === adminEmail.toLowerCase().trim()
    }
    const showAdminDebug = isDevelopment && isAdmin()

    const logoutUser = async ()=>{
        // Clear local storage
        localStorage.removeItem('token')
        // Clear Redux state
        dispatch(logout())
        // Navigate to home
        navigate('/')
        // Optionally call logout endpoint to clear server-side session
        // await api.post('/api/users/logout')
    }

  return (
    <div className='shadow bg-white relative'>
      {/* Temporary debug indicator for admin override (development only) */}
      {showAdminDebug && (
        <div className='absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-bl-lg font-medium z-50 shadow-sm'>
          Premium Active (Admin)
        </div>
      )}
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <Link to="/">
            <img src="/logo.svg" alt="HireCraft logo" className="h-11 w-auto" />
        </Link>
        <div className='flex items-center gap-4 text-sm'>
            <Link 
              to="/app/pricing" 
              className='flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors'
            >
              <Crown className="size-4" />
              <span className='max-sm:hidden'>Pricing</span>
            </Link>
            <p className='max-sm:hidden'>Hi, {user?.name}</p>
            <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
