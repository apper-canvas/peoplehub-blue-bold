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
  const [showAttendanceMarking, setShowAttendanceMarking] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [bulkAttendanceStatus, setBulkAttendanceStatus] = useState('Present')

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

  const handleBulkAttendanceMarking = () => {
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee')
      return
    }

    const today = format(new Date(), 'yyyy-MM-dd')
    const currentTime = format(new Date(), 'HH:mm')
    
    selectedEmployees.forEach(employeeId => {
      const existingRecordIndex = attendance.findIndex(a => a.employeeId === employeeId && a.date === today)
      
      if (existingRecordIndex !== -1) {
        // Update existing record
        const updatedAttendance = [...attendance]
        updatedAttendance[existingRecordIndex] = {
          ...updatedAttendance[existingRecordIndex],
          status: bulkAttendanceStatus,
          checkIn: bulkAttendanceStatus !== 'Absent' ? (updatedAttendance[existingRecordIndex].checkIn || currentTime) : '',
          checkOut: bulkAttendanceStatus === 'Absent' ? '' : updatedAttendance[existingRecordIndex].checkOut
        }
        setAttendance(updatedAttendance)
      } else {
        // Create new record
        const newAttendance = {
          id: (attendance.length + Math.random()).toString(),
          employeeId,
          date: today,
          status: bulkAttendanceStatus,
          checkIn: bulkAttendanceStatus !== 'Absent' ? currentTime : '',
          checkOut: ''
        }
        setAttendance(prev => [...prev, newAttendance])
      }
    })

    toast.success(`Marked ${selectedEmployees.length} employee(s) as ${bulkAttendanceStatus}`)
    setSelectedEmployees([])
    setShowAttendanceMarking(false)
  }

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const markIndividualAttendance = (employeeId, status) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const currentTime = format(new Date(), 'HH:mm')
    const existingRecordIndex = attendance.findIndex(a => a.employeeId === employeeId && a.date === today)
    
    if (existingRecordIndex !== -1) {
      // Update existing record
      const updatedAttendance = [...attendance]
      updatedAttendance[existingRecordIndex] = {
        ...updatedAttendance[existingRecordIndex],
        status: status,
        checkIn: status !== 'Absent' ? (updatedAttendance[existingRecordIndex].checkIn || currentTime) : '',
        checkOut: status === 'Absent' ? '' : updatedAttendance[existingRecordIndex].checkOut
      }
      setAttendance(updatedAttendance)
    } else {
      // Create new record
      const newAttendance = {
        id: (attendance.length + Math.random()).toString(),
        employeeId,
        date: today,
        status: status,
        checkIn: status !== 'Absent' ? currentTime : '',
        checkOut: ''
      }
      setAttendance(prev => [...prev, newAttendance])
    }

    const employee = employees.find(emp => emp.id === employeeId)
    toast.success(`${employee?.firstName} ${employee?.lastName} marked as ${status}`)
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

  const handleAttendanceToggle = (employeeId) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const currentTime = format(new Date(), 'HH:mm')
    const existingRecordIndex = attendance.findIndex(a => a.employeeId === employeeId && a.date === today)
    
    if (existingRecordIndex !== -1) {
      // Employee has a record for today
      const existingRecord = attendance[existingRecordIndex]
      
      if (existingRecord.checkOut) {
        // Already signed out, create new sign-in record
        const newAttendance = {
          id: (attendance.length + 1).toString(),
          employeeId,
          date: today,
          status: 'Present',
          checkIn: currentTime,
          checkOut: ''
        }
        setAttendance([...attendance, newAttendance])
        toast.success('Signed in successfully!')
      } else {
        // Currently signed in, sign out
        const updatedAttendance = [...attendance]
        updatedAttendance[existingRecordIndex] = {
          ...existingRecord,
          checkOut: currentTime
        }
        setAttendance(updatedAttendance)
        toast.success('Signed out successfully!')
      }
    } else {
      // No record for today, create new sign-in
      const newAttendance = {
        id: (attendance.length + 1).toString(),
        employeeId,
        date: today,
        status: 'Present',
        checkIn: currentTime,
        checkOut: ''
      }
      setAttendance([...attendance, newAttendance])
      toast.success('Signed in successfully!')
    }
  }

  const getEmployeeAttendanceStatus = (employeeId) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayRecords = attendance.filter(a => a.employeeId === employeeId && a.date === today)
    
    if (todayRecords.length === 0) return { isSignedIn: false, signInTime: null }
    
    const latestRecord = todayRecords[todayRecords.length - 1]
    return {
      isSignedIn: !latestRecord.checkOut,
      signInTime: latestRecord.checkIn
    }
  }

  const getTodayAttendanceStatus = (employeeId) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayRecord = attendance.find(a => a.employeeId === employeeId && a.date === today)
    
    if (!todayRecord) return 'Not Marked'
    return todayRecord.status
  }

  const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn) return 'N/A'
    if (!checkOut) return 'In Progress'
    
    const [inHours, inMinutes] = checkIn.split(':').map(Number)
    const [outHours, outMinutes] = checkOut.split(':').map(Number)
    
    const inTotalMinutes = inHours * 60 + inMinutes
    const outTotalMinutes = outHours * 60 + outMinutes
    
    const diffMinutes = outTotalMinutes - inTotalMinutes
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    
    return `${hours}h ${minutes}m`
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
                {(() => {
                  const attendanceStatus = getEmployeeAttendanceStatus(employee.id)
                  return (
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleAttendanceToggle(employee.id)}
                        className={`inline-flex items-center px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                          attendanceStatus.isSignedIn 
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-secondary hover:bg-secondary-dark text-white'
                        }`}
                      >
                        <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                        {attendanceStatus.isSignedIn ? 'Sign Out' : 'Sign In'}
                      </button>
                      {attendanceStatus.signInTime && attendanceStatus.isSignedIn && (
                        <span className="text-xs text-surface-500 dark:text-surface-400">
                          In at: {attendanceStatus.signInTime}
                        </span>
                      )}
                    </div>
                  )
                })()}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg lg:text-xl font-semibold text-surface-900 dark:text-white">
          Attendance Tracking
        </h3>
        <button
          onClick={() => setShowAttendanceMarking(!showAttendanceMarking)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300 text-sm lg:text-base"
        >
          <ApperIcon name="CheckSquare" className="h-4 w-4 mr-2" />
          Mark Attendance
        </button>
      </div>

      <AnimatePresence>
        {showAttendanceMarking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 mb-6"
          >
            <h4 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Today's Attendance - {format(new Date(), 'MMM dd, yyyy')}
            </h4>
            
            {/* Bulk Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-4 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Bulk Actions:
                </span>
                <select
                  value={bulkAttendanceStatus}
                  onChange={(e) => setBulkAttendanceStatus(e.target.value)}
                  className="px-3 py-1 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded text-sm"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
                <button
                  onClick={handleBulkAttendanceMarking}
                  disabled={selectedEmployees.length === 0}
                  className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply ({selectedEmployees.length})
                </button>
              </div>
              <button
                onClick={() => setSelectedEmployees(selectedEmployees.length === employees.length ? [] : employees.map(emp => emp.id))}
                className="text-sm text-primary hover:text-primary-dark"
              >
                {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            {/* Employee List for Attendance Marking */}
            <div className="grid gap-3">
              {employees.map((employee) => {
                const todayStatus = getTodayAttendanceStatus(employee.id)
                const isSelected = selectedEmployees.includes(employee.id)
                
                return (
                  <div
                    key={employee.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleEmployeeSelection(employee.id)}
                        className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                      />
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-surface-900 dark:text-white">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-300">
                          {employee.department}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        todayStatus === 'Present' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        todayStatus === 'Absent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        todayStatus === 'Late' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
                      }`}>
                        {todayStatus}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => markIndividualAttendance(employee.id, 'Present')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markIndividualAttendance(employee.id, 'Late')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
                      >
                        Late
                      </button>
                      <button
                        onClick={() => markIndividualAttendance(employee.id, 'Absent')}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <h4 className="text-md font-semibold text-surface-900 dark:text-white mb-4">
        Attendance Records
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
                  <div className="text-surface-600 dark:text-surface-300 text-sm space-y-1">
                    In: {record.checkIn} {record.checkOut && `• Out: ${record.checkOut}`}
                  </div>
                  <div className="text-surface-700 dark:text-surface-200 text-sm font-medium">
                    <span className="text-xs text-surface-500 dark:text-surface-400">Total Hours: </span>
                    <span className={`${calculateTotalHours(record.checkIn, record.checkOut) === 'In Progress' 
                      ? 'text-blue-600 dark:text-blue-400' : 'text-surface-900 dark:text-white'}`}>
                      {calculateTotalHours(record.checkIn, record.checkOut)}
                    </span>
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


  return (
    <div className="bg-white/30 dark:bg-surface-800/30 backdrop-blur-lg rounded-3xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden shadow-neu-light dark:shadow-neu-dark">
      {/* Tab Navigation */}
      <div className="border-b border-surface-200/50 dark:border-surface-700/50">
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