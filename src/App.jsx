import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ApperIcon from './components/ApperIcon'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 transition-colors duration-300">
      <Router>
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
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

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
  )
}

export default App