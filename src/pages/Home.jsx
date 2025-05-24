import React from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const stats = [
    { label: "Active Employees", value: "1,247", icon: "Users", color: "text-primary" },
    { label: "Projects Running", value: "89", icon: "Briefcase", color: "text-secondary" },
    { label: "Departments", value: "12", icon: "Building2", color: "text-accent" },
    { label: "Avg Performance", value: "4.2", icon: "TrendingUp", color: "text-green-500" }
  ]

  const quickActions = [
    { label: "Add Employee", icon: "UserPlus", color: "bg-primary", path: "/" },
    { label: "Mark Attendance", icon: "Clock", color: "bg-secondary", path: "/" },
    { label: "Assign Project", icon: "FolderPlus", color: "bg-accent", path: "/" },
    { label: "Analytics Dashboard", icon: "BarChart3", color: "bg-purple-500", path: "/analytics" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-soft">
                <ApperIcon name="Users" className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4">
              PeopleHub
            </h1>
            <p className="text-surface-600 dark:text-surface-300 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto">
              Streamline your HR operations with our comprehensive employee management platform
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 hover:shadow-card transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <ApperIcon 
                    name={stat.icon} 
                    className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`} 
                  />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm lg:text-base text-surface-600 dark:text-surface-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 lg:mb-12"
          >
            <h2 className="text-xl lg:text-2xl font-semibold text-surface-900 dark:text-white mb-4 lg:mb-6 text-center">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Link to={action.path}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${action.color} text-white rounded-xl p-4 lg:p-6 shadow-soft hover:shadow-card transition-all duration-300 group w-full`}
                    >
                      <ApperIcon 
                        name={action.icon} 
                        className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300" 
                      />
                      <div className="text-sm lg:text-base font-medium">{action.label}</div>
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Feature Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <MainFeature />
      </div>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-950 text-white py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center mb-4 lg:mb-0">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg mr-3">
                <ApperIcon name="Users" className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">PeopleHub</span>
            </div>
            <div className="text-surface-400 text-sm lg:text-base text-center lg:text-right">
              © 2024 PeopleHub. Streamlining HR management for modern teams.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home