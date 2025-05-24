import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-secondary rounded-full mb-6">
            <ApperIcon name="AlertTriangle" className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl lg:text-8xl font-bold gradient-text mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl lg:text-3xl font-semibold text-surface-900 dark:text-white mb-4"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-surface-600 dark:text-surface-300 text-lg lg:text-xl mb-8 max-w-md mx-auto"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-card transform hover:scale-105 transition-all duration-300"
          >
            <ApperIcon name="Home" className="h-5 w-5 mr-2" />
            Return to Home
          </Link>
        </motion.div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/5 to-primary/5 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default NotFound