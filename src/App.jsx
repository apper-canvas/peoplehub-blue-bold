import React, { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { setUser, clearUser } from './store/userSlice'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Callback from './pages/Callback'
import ErrorPage from './pages/ErrorPage'
import ApperIcon from './components/ApperIcon'

// Create auth context
export const AuthContext = createContext(null)

function AppContent() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [darkMode, setDarkMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user)
  const isAuthenticated = userState?.isAuthenticated || false

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })

    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true)
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search
        let redirectPath = new URLSearchParams(window.location.search).get('redirect')
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes('/callback') || currentPath.includes('/error')
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath)
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath)
            } else {
              navigate('/')
            }
          } else {
            navigate('/')
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))))
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
               ? `/signup?redirect=${currentPath}`
               : currentPath.includes('/login')
               ? `/login?redirect=${currentPath}`
               : '/login')
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`)
            else {
              navigate(currentPath)
            }
          } else if (isAuthPage) {
            navigate(currentPath)
          } else {
            navigate('/login')
          }
          dispatch(clearUser())
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error)
        setIsInitialized(true)
      }
    })
  }, [navigate, dispatch])

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK
        await ApperUI.logout()
        dispatch(clearUser())
        navigate('/login')
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Initializing application...</div>
    </div>
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 transition-colors duration-300">
        {/* Dark Mode Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-white dark:bg-surface-800 shadow-soft hover:shadow-card transition-all duration-300 border border-surface-200 dark:border-surface-700"
          >
            <ApperIcon 
              name={darkMode ? "Sun" : "Moon"} 
              className="h-5 w-5 text-surface-600 dark:text-surface-300" 
            />
          </button>
        </div>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          className="mt-16"
        />
      </div>
    </AuthContext.Provider>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App