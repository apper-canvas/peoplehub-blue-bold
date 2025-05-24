import React, { useState, useEffect, createContext, Component } from 'react'
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

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
          <div className="max-w-md w-full p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h2>
            <p className="text-surface-700 dark:text-surface-300 mb-6">
              The application encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left text-sm">
                <summary className="cursor-pointer text-surface-600 dark:text-surface-400">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-2 bg-surface-100 dark:bg-surface-700 rounded text-xs overflow-auto">
                  {this.state.error && this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function AppContent() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [darkMode, setDarkMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [initError, setInitError] = useState(null)
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user)
  const isAuthenticated = userState?.isAuthenticated || false

  // Check for SDK availability first
  useEffect(() => {
    const checkSDK = () => {
      if (window.ApperSDK && window.ApperSDK.ApperClient && window.ApperSDK.ApperUI) {
        setSdkLoaded(true)
      } else {
        // Retry after a short delay
        setTimeout(checkSDK, 100)
      }
    }
    
    checkSDK()
  }, [])

  // Initialize ApperUI once SDK is loaded
  useEffect(() => {
    if (!sdkLoaded) return
    
    try {
      const { ApperClient, ApperUI } = window.ApperSDK
      
      if (!ApperClient || !ApperUI) {
        throw new Error('Apper SDK components not available')
      }
      
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
          setInitError(null)
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
          setInitError('Authentication initialization failed. Please refresh the page.')
        }
      })
    } catch (error) {
      console.error("Failed to initialize Apper SDK:", error)
      setInitError('Failed to initialize application. Please refresh the page.')
      setIsInitialized(true)
    }
  }, [sdkLoaded, navigate, dispatch])

  // Dark mode effect - must be declared before conditional return
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Define toggleDarkMode before conditional return
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK || {}
        if (!ApperUI) {
          throw new Error('Apper SDK not available')
        }
        await ApperUI.logout()
        dispatch(clearUser())
        navigate('/login')
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }

  // Don't render routes until initialization is complete
  if (!sdkLoaded || !isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-lg mb-2">
          {!sdkLoaded ? 'Loading SDK...' : 'Initializing application...'}
        </div>
        {initError && (
          <div className="text-red-600 dark:text-red-400 text-sm max-w-md mx-auto">
            {initError}
          </div>
        )}
      </div>
    </div>
  }

  if (initError && isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
          Initialization Error
        </div>
        <div className="text-surface-700 dark:text-surface-300 mb-6">
          {initError}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  }

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
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

export default App