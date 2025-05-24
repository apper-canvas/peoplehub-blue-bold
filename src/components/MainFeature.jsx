import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { format } from 'date-fns'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('employees')
  const [employees, setEmployees] = useState([
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'Active',
      hireDate: '2022-03-15'
    },
    {
      id: '2', 
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.c@company.com',
      department: 'Design',
      position: 'UI/UX Designer',
      status: 'Active',
      hireDate: '2023-01-20'
    }
  ])

  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Mobile App Redesign',
      status: 'In Progress',
      assignedEmployees: ['1', '2'],
      progress: 75,
      endDate: '2024-12-31'
    },
    {
      id: '2',
      name: 'HR Dashboard',
      status: 'Planning',
      assignedEmployees: ['1'],
      progress: 30,
      endDate: '2024-11-15'
    }
  ])

  const [attendance, setAttendance] = useState([
    {
      id: '1',
      employeeId: '1',
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'Present',
      checkIn: '09:00',
      checkOut: '17:30'
    },
    {
      id: '2',
      employeeId: '2', 
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'Present',
      checkIn: '09:15',
      checkOut: '17:45'
    }
  ])

  const [performanceReviews, setPerformanceReviews] = useState([
    {
      id: '1',
      employeeId: '1',
      quarter: 'Q3 2024',
      score: 4.2,
      reviewDate: '2024-09-15',
      goals: 'Improve team collaboration'
    },
    {
      id: '2',
      employeeId: '2',
      quarter: 'Q3 2024',
      score: 4.5,
      reviewDate: '2024-09-20',
      goals: 'Lead design system project'
    }
  ])

  const [formData, setFormData] = useState({
    firstName: '',

    lastName: '',
    email: '',
    department: '',
    position: '',
    status: 'Active'
  })

  const [showAddForm, setShowAddForm] = useState(false)

  const tabs = [
    { id: 'employees', label: 'Employees', icon: 'Users', count: employees.length },
    { id: 'projects', label: 'Projects', icon: 'Briefcase', count: projects.length },
    { id: 'attendance', label: 'Attendance', icon: 'Clock', count: attendance.length },
    { id: 'performance', label: 'Performance', icon: 'BarChart3', count: performanceReviews.length }
  ]

  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance']

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddEmployee = (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    const newEmployee = {
      id: (employees.length + 1).toString(),
      ...formData,
      hireDate: format(new Date(), 'yyyy-MM-dd')
    }

    setEmployees([...employees, newEmployee])
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      status: 'Active'
    })
    setShowAddForm(false)
    toast.success('Employee added successfully!')
  }

  const getEmployeePerformanceAvg = (employeeId) => {
    const reviews = performanceReviews.filter(r => r.employeeId === employeeId)
    if (reviews.length === 0) return 'N/A'
    const avg = reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length
    return avg.toFixed(1)
  }

  const getProjectCompletionRate = () => {
    if (projects.length === 0) return 0
    const totalProgress = projects.reduce((sum, project) => sum + project.progress, 0)
    return (totalProgress / projects.length).toFixed(1)
  }

  const handleMarkAttendance = (employeeId) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const existingRecord = attendance.find(a => a.employeeId === employeeId && a.date === today)
    
    if (existingRecord) {
      toast.error('Attendance already marked for today')
      return
    }

    const newAttendance = {
      id: (attendance.length + 1).toString(),
      employeeId,
      date: today,
      status: 'Present',
      checkIn: format(new Date(), 'HH:mm'),
      checkOut: ''
    }

    setAttendance([...attendance, newAttendance])
    toast.success('Attendance marked successfully!')
  }

  const renderEmployees = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg lg:text-xl font-semibold text-surface-900 dark:text-white">
          Employee Management
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300 text-sm lg:text-base"
        >
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 mb-6"
          >
            <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {employees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 hover:shadow-card transition-all duration-300 group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-semibold text-lg">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-white">
                    {employee.firstName} {employee.lastName}
                  </h4>
                  <p className="text-surface-600 dark:text-surface-300 text-sm">
                    {employee.position} • {employee.department}
                  </p>
                  <p className="text-surface-500 dark:text-surface-400 text-xs">
                    {employee.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {employee.status}
                </span>
                <button
                  onClick={() => handleMarkAttendance(employee.id)}
                  className="inline-flex items-center px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-300 text-sm"
                >
                  <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                  Mark Attendance
                </button>
                <div className="text-xs text-surface-500 dark:text-surface-400">
                  Avg Score: {getEmployeePerformanceAvg(employee.id)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderProjects = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h3 className="text-lg lg:text-xl font-semibold text-surface-900 dark:text-white mb-6">
        Project Management
      </h3>
      <div className="grid gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 hover:shadow-card transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  {project.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'In Progress' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-surface-500 dark:text-surface-400 text-sm">
                    Due: {format(new Date(project.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="text-surface-600 dark:text-surface-300 text-sm">
                  {project.assignedEmployees.length} employee(s) assigned
                </div>
                <div className="text-surface-500 dark:text-surface-400 text-sm">
                  Progress: {project.progress}%
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {project.assignedEmployees.map(empId => {
                  const emp = employees.find(e => e.id === empId)
                  return emp ? (
                    <div key={empId} className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                  ) : null
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderAttendance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h3 className="text-lg lg:text-xl font-semibold text-surface-900 dark:text-white mb-6">
        Attendance Tracking
      </h3>
      <div className="grid gap-4">
        {attendance.map((record, index) => {
          const employee = employees.find(emp => emp.id === record.employeeId)
          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 hover:shadow-card transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-dark rounded-full flex items-center justify-center">
                    <ApperIcon name="Clock" className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-surface-900 dark:text-white">
                      {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
                    </h4>
                    <p className="text-surface-600 dark:text-surface-300 text-sm">
                      {format(new Date(record.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                    {record.status}
                  </span>
                  <div className="text-surface-600 dark:text-surface-300 text-sm">
                    In: {record.checkIn} {record.checkOut && `• Out: ${record.checkOut}`}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
  const renderPerformance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h3 className="text-lg lg:text-xl font-semibold text-surface-900 dark:text-white mb-6">
        Performance Reviews
      </h3>
      <div className="grid gap-4">
        {performanceReviews.map((review, index) => {
          const employee = employees.find(emp => emp.id === review.employeeId)
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 hover:shadow-card transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="BarChart3" className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-surface-900 dark:text-white">
                      {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
                    </h4>
                    <p className="text-surface-600 dark:text-surface-300 text-sm">
                      {review.quarter} • {format(new Date(review.reviewDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{review.score}</div>
                  <div className="text-surface-600 dark:text-surface-300 text-sm">{review.goals}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )


    <div className="bg-white/30 dark:bg-surface-800/30 backdrop-blur-lg rounded-3xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden shadow-neu-light dark:shadow-neu-dark">
      {/* Tab Navigation */}
      <div className="border-b border-surface-200/50 dark:border-surface-700/50">
  return (
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 lg:px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap min-w-0 ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary bg-primary/5'
                  : 'text-surface-600 dark:text-surface-300 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <ApperIcon name={tab.icon} className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm lg:text-base">{tab.label}</span>
              <span className="bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-full px-2 py-1 text-xs font-semibold">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'employees' && renderEmployees()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'attendance' && renderAttendance()}
          {activeTab === 'performance' && renderPerformance()}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MainFeature