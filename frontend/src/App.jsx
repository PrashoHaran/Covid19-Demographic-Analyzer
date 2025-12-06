import React from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import Verify from './pages/Verify'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOTP'
import ChangePassword from './pages/ChangePassword'
import AuthSuccess from './pages/AuthSuccess'
import CompareCountries from './pages/CompareCountries'
import CountryDetails from './pages/CountryDetails'
import VisualAnalytics from './pages/VisualAnalytics'
import About from './pages/about'
import Footer from './components/Footer'
import ProfilePage from './pages/profile'

const router = createBrowserRouter([
    {
    path: '/',
    element: <><Navbar /><Home /><Footer /></>
  },

  {
    path: '/countries',
    element: (
      <ProtectedRoute>
        <><Navbar /><About /><Footer /></>
      </ProtectedRoute>
    )
  },

  {
    path: '/compare',
    element: (
      <ProtectedRoute>
        <><Navbar /><CompareCountries /><Footer /></>
      </ProtectedRoute>
    )
  },

  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <><Navbar /><VisualAnalytics /></>
      </ProtectedRoute>
    )
  },

  {
    path: '/country/:countryCode',
    element: (
      <ProtectedRoute>
        <><Navbar /><CountryDetails /><Footer /></>
      </ProtectedRoute>
    )
  },

  { path: '/signup', element: <Signup /> },
  { path: '/profile', element: <><ProfilePage /><Footer/> </>},
  { path: '/verify', element: <VerifyEmail /> },
  { path: '/verify/:token', element: <Verify /> },
  { path: '/login', element: <Login /> },
  { path: '/auth-success', element: <AuthSuccess /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/verify-otp/:email', element: <VerifyOTP /> },
  { path: '/change-password/:email', element: <ChangePassword /> },
])

const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
