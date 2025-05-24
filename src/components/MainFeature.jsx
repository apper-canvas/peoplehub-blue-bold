import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { format } from 'date-fns'
import employeeService from '../services/employeeService'
import projectService from '../services/projectService'
import attendanceService from '../services/attendanceService'
import performanceService from '../services/performanceService'
import projectAssignmentService from '../services/projectAssignmentService'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('employees')
  
  // Data states
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [attendance, setAttendance] = useState([])
  const [performanceReviews, setPerformanceReviews] = useState([])
  const [projectAssignments, setProjectAssignments] = useState([])
  
  // Loading states
  const [employeesLoading, setEmployeesLoading] = useState(false)
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [performanceLoading, setPerformanceLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    status: 'Active'
  })

  const [projectFormData, setProjectFormData] = useState({
    Name: '',
    status: 'Planning',
    endDate: '',
    description: ''
  })

  // Modal states
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAddProjectForm, setShowAddProjectForm] = useState(false)
  const [showAttendanceMarking, setShowAttendanceMarking] = useState(false)
  const [showProjectAssignment, setShowProjectAssignment] = useState(false)
  const [selectedProjectForAssignment, setSelectedProjectForAssignment] = useState(null)
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [bulkAttendanceStatus, setBulkAttendanceStatus] = useState('Present')

  // Load initial data
  useEffect(() => {
    // Load all initial data when component mounts
    loadEmployees()
    loadProjects()
    loadAttendance()
    loadPerformanceReviews()
  }, []) // No dependencies needed as this should only run once on mount

  const loadEmployees = async () => {
    try {
      setEmployeesLoading(true)
      const data = await employeeService.fetchEmployees()
      setEmployees(data || [])
    } catch (error) {
      console.error('Error loading employees:', error)
      toast.error('Failed to load employees')
    } finally {
      setEmployeesLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      setProjectsLoading(true)
      const [projectsData, assignmentsData] = await Promise.all([
        projectService.fetchProjects(),
        projectAssignmentService.fetchProjectAssignments()
      ])
      
      // Map assignments to projects
      const projectsWithAssignments = (projectsData || []).map(project => ({
        ...project,
        assignedEmployees: (assignmentsData || [])
          .filter(assignment => assignment?.projectId === project?.Id)
          .map(assignment => assignment?.employeeId)
      }))
      
      setProjects(projectsWithAssignments)
      setProjectAssignments(assignmentsData || [])
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setProjectsLoading(false)
    }
  }

  const loadAttendance = async () => {
    try {
      setAttendanceLoading(true)
      const data = await attendanceService.fetchAttendance()
      setAttendance(data || [])
    } catch (error) {
      console.error('Error loading attendance:', error)
      toast.error('Failed to load attendance records')
    } finally {
      setAttendanceLoading(false)
    }
  }

  const loadPerformanceReviews = async () => {
    try {
      setPerformanceLoading(true)
      const data = await performanceService.fetchPerformanceReviews()
      setPerformanceReviews(data || [])
    } catch (error) {
      console.error('Error loading performance reviews:', error)
      toast.error('Failed to load performance reviews')
    } finally {
      setPerformanceLoading(false)
    }
  }

  const tabs = [
    { id: 'employees', label: 'Employees', icon: 'Users', count: employees?.length || 0 },
    { id: 'projects', label: 'Projects', icon: 'Briefcase', count: projects?.length || 0 },
    { id: 'attendance', label: 'Attendance', icon: 'Clock', count: attendance?.length || 0 },
    { id: 'performance', label: 'Performance', icon: 'BarChart3', count: performanceReviews?.length || 0 }
  ]

  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance']

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setFormSubmitting(true)
      const employeeData = {
        ...formData,
        hireDate: format(new Date(), 'yyyy-MM-dd')
      }
      
      const newEmployee = await employeeService.createEmployee(employeeData)
      setEmployees(prev => [...(prev || []), newEmployee])
      
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
    } catch (error) {
      console.error('Error creating employee:', error)
      toast.error('Failed to add employee')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleProjectInputChange = (e) => {
    setProjectFormData({
      ...projectFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddProject = async (e) => {
    e.preventDefault()
    
    if (!projectFormData.Name || !projectFormData.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setFormSubmitting(true)
      const projectData = {
        ...projectFormData,
        progress: 0
      }
      
      const newProject = await projectService.createProject(projectData)
      setProjects(prev => [...(prev || []), { ...newProject, assignedEmployees: [] }])
      
      setProjectFormData({ Name: '', status: 'Planning', endDate: '', description: '' })
      setShowAddProjectForm(false)
      toast.success('Project added successfully!')
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to add project')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleBulkAttendanceMarking = async () => {
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee')
      return
    }

    try {
      setFormSubmitting(true)
      const today = format(new Date(), 'yyyy-MM-dd')
      const currentTime = format(new Date(), 'HH:mm')
      
      const attendancePromises = (selectedEmployees || []).map(async (employeeId) => {
        const existingRecord = (attendance || []).find(a => a?.employeeId === employeeId && a?.date === today)
        
        const attendanceData = {
          employeeId,
          date: today,
          status: bulkAttendanceStatus,
          checkIn: bulkAttendanceStatus !== 'Absent' ? currentTime : '',
          checkOut: ''
        }
        
        if (existingRecord) {
          return await attendanceService.updateAttendance(existingRecord.Id, {
            ...attendanceData,
            checkIn: bulkAttendanceStatus !== 'Absent' ? (existingRecord.checkIn || currentTime) : '',
            checkOut: bulkAttendanceStatus === 'Absent' ? '' : existingRecord.checkOut
          })
        } else {
          return await attendanceService.createAttendance(attendanceData)
        }
      })
      
      await Promise.all(attendancePromises)
      await loadAttendance() // Reload attendance data
      
      toast.success(`Marked ${selectedEmployees.length} employee(s) as ${bulkAttendanceStatus}`)
      setSelectedEmployees([])
      setShowAttendanceMarking(false)
    } catch (error) {
      console.error('Error marking bulk attendance:', error)
      toast.error('Failed to mark attendance')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const markIndividualAttendance = async (employeeId, status) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const currentTime = format(new Date(), 'HH:mm')
      const existingRecord = (attendance || []).find(a => a?.employeeId === employeeId && a?.date === today)
      
      const attendanceData = {
        employeeId,
        date: today,
        status: status,
        checkIn: status !== 'Absent' ? currentTime : '',
        checkOut: ''
      }
      
      if (existingRecord) {
        await attendanceService.updateAttendance(existingRecord.Id, {
          ...attendanceData,
          checkIn: status !== 'Absent' ? (existingRecord.checkIn || currentTime) : '',
          checkOut: status === 'Absent' ? '' : existingRecord.checkOut
        })
      } else {
        await attendanceService.createAttendance(attendanceData)
      }
      
      await loadAttendance() // Reload attendance data
      
      const employee = (employees || []).find(emp => emp?.Id === employeeId)
      toast.success(`${employee?.firstName} ${employee?.lastName} marked as ${status}`)
    } catch (error) {
      console.error('Error marking individual attendance:', error)
      toast.error('Failed to mark attendance')
    }
  }

  const getEmployeePerformanceAvg = (employeeId) => {
    const reviews = (performanceReviews || []).filter(r => r?.employeeId === employeeId)
    if (!reviews || reviews.length === 0) return 'N/A'
    const avg = reviews.reduce((sum, review) => sum + (review?.score || 0), 0) / reviews.length
    return avg.toFixed(1)
  }

  const getProjectCompletionRate = () => {
    if (projects.length === 0) return 0
    const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0)
    return (totalProgress / projects.length).toFixed(1)
  }

  const handleAttendanceToggle = async (employeeId) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const currentTime = format(new Date(), 'HH:mm')
      const existingRecord = (attendance || []).find(a => a?.employeeId === employeeId && a?.date === today)
      
      if (existingRecord) {
        if (existingRecord?.checkOut) {
          // Already signed out, create new sign-in record
          const attendanceData = {
            employeeId,
            date: today,
            status: 'Present',
            checkIn: currentTime,
            checkOut: ''
          }
          await attendanceService.createAttendance(attendanceData)
          toast.success('Signed in successfully!')
        } else {
          // Currently signed in, sign out
          await attendanceService.updateAttendance(existingRecord.Id, {
            ...existingRecord,
            checkOut: currentTime
          })
          toast.success('Signed out successfully!')
        }
      } else {
        // No record for today, create new sign-in
        const attendanceData = {
          employeeId,
          date: today,
          status: 'Present',
          checkIn: currentTime,
          checkOut: ''
        }
        await attendanceService.createAttendance(attendanceData)
        toast.success('Signed in successfully!')
      }
      
      await loadAttendance() // Reload attendance data
    } catch (error) {
      console.error('Error toggling attendance:', error)
      toast.error('Failed to update attendance')
    }
  }

  const getEmployeeAttendanceStatus = (employeeId) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayRecords = (attendance || []).filter(a => a?.employeeId === employeeId && a?.date === today)
    
    if (!todayRecords || todayRecords.length === 0) return { isSignedIn: false, signInTime: null }
    
    const latestRecord = todayRecords?.[todayRecords.length - 1]
    return {
      isSignedIn: !latestRecord?.checkOut,
      signInTime: latestRecord?.checkIn
    }
  }

  const getTodayAttendanceStatus = (employeeId) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayRecord = (attendance || []).find(a => a?.employeeId === employeeId && a?.date === today)
    
    if (!todayRecord) return 'Not Marked'
    return todayRecord?.status || 'Not Marked'
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

  const handleAssignProject = (projectId) => {
    const project = (projects || []).find(p => p?.Id === projectId)
    setSelectedProjectForAssignment(project)
    setShowProjectAssignment(true)
  }

  const handleProjectAssignment = async () => {
    if (!selectedProjectForAssignment) return
    
    try {
      setFormSubmitting(true)
      
      // Update project assignments in database
      await projectAssignmentService.updateProjectAssignments(
        selectedProjectForAssignment.Id, 
        selectedEmployees
      )
      
      // Update local state
      const updatedProjects = (projects || []).map(project => 
        project?.Id === selectedProjectForAssignment?.Id 
          ? { ...project, assignedEmployees: selectedEmployees || [] }
          : project
      )
      
      setProjects(updatedProjects)
      toast.success(`Project "${selectedProjectForAssignment.Name}" assignments updated successfully!`)
      setShowProjectAssignment(false)
      setSelectedProjectForAssignment(null)
      setSelectedEmployees([])
    } catch (error) {
      console.error('Error updating project assignments:', error)
      toast.error('Failed to update project assignments')
    } finally {
      setFormSubmitting(false)
    }
  }

  const toggleEmployeeAssignment = (employeeId) => {
    if (!selectedProjectForAssignment) return
    
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const initializeProjectAssignment = (project) => {
    setSelectedProjectForAssignment(project)
    setSelectedEmployees(project?.assignedEmployees || [])
    setShowProjectAssignment(true)
  }

  const closeProjectAssignment = () => {
    setShowProjectAssignment(false)
    setSelectedProjectForAssignment(null)
    setSelectedEmployees([])
  }

  if (employeesLoading && (!projects || projects.length === 0)) {
    return (
      <div className="bg-white/30 dark:bg-surface-800/30 backdrop-blur-lg rounded-3xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden shadow-neu-light dark:shadow-neu-dark">
        <div className="p-8 text-center">
          <div className="text-lg">Loading data...</div>
        </div>
      </div>
    )
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
          disabled={formSubmitting}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300 text-sm lg:text-base disabled:opacity-50"
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
                  disabled={formSubmitting}
                  className="w-full px-4 py-2 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300 disabled:opacity-50"
                >
                  {formSubmitting ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {(employees || []).map((employee, index) => (
          <motion.div
            key={employee.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 hover:shadow-card transition-all duration-300 group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-semibold text-lg">
                    {employee.firstName?.[0]}{employee.lastName?.[0]}
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
                  const attendanceStatus = getEmployeeAttendanceStatus(employee.Id)
                  return (
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleAttendanceToggle(employee.Id)}
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
                  Avg Score: {getEmployeePerformanceAvg(employee.Id)}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg lg:text-xl font-semibold text-surface-900 dark:text-white">
          Project Management
        </h3>
        <button
          onClick={() => setShowAddProjectForm(!showAddProjectForm)}
          disabled={formSubmitting}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300 text-sm lg:text-base disabled:opacity-50"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

      <AnimatePresence>
        {showAddProjectForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 mb-6"
          >
            <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="Name"
                  value={projectFormData.Name}
                  onChange={handleProjectInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={projectFormData.status}
                  onChange={handleProjectInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={projectFormData.endDate}
                  onChange={handleProjectInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={projectFormData.description}
                  onChange={handleProjectInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Project description..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300 disabled:opacity-50"
                >
                  {formSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {(projects || []).map((project, index) => (
          <motion.div
            key={project.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50 hover:shadow-card transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  {project.Name}
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
                    Due: {project?.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'No deadline'}
                  </span>
                </div>
                <div className="text-surface-600 dark:text-surface-300 text-sm">
                  {project.assignedEmployees?.length || 0} employee(s) assigned
                </div>
                <div className="text-surface-500 dark:text-surface-400 text-sm">
                  Progress: {project.progress || 0}%
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => initializeProjectAssignment(project)}
                  disabled={formSubmitting}
                  className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300 text-sm disabled:opacity-50"
                >
                  <ApperIcon name="UserPlus" className="h-4 w-4 mr-1" />
                  Assign Employees
                </button>
                {(project?.assignedEmployees || []).map(empId => {
                  const emp = (employees || []).find(e => e?.Id === empId)
                  return emp ? (
                    <div key={empId} className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {emp.firstName?.[0]}{emp.lastName?.[0]}
                    </div>
                  ) : null
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Assignment Modal */}
      <AnimatePresence>
        {showProjectAssignment && selectedProjectForAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeProjectAssignment}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                  Assign Employees to "{selectedProjectForAssignment.Name}"
                </h3>
                <button
                  onClick={closeProjectAssignment}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                >
                  <ApperIcon name="X" className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-surface-900 dark:text-white">
                  Select Employees ({(selectedEmployees || []).length} selected)
                </h4>
                <div className="grid gap-3">
                  {(employees || []).map((employee) => {
                    const isSelected = (selectedEmployees || []).includes(employee?.Id)
                    return (
                      <div
                        key={employee?.Id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-surface-200 dark:border-surface-700 hover:border-primary/50'
                        }`}
                        onClick={() => toggleEmployeeAssignment(employee?.Id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleEmployeeAssignment(employee?.Id)}
                          className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                        />
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-surface-900 dark:text-white">
                            {employee?.firstName} {employee?.lastName}
                          </div>
                          <div className="text-sm text-surface-600 dark:text-surface-300">
                            {employee?.position} • {employee?.department}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeProjectAssignment}
                  className="px-4 py-2 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProjectAssignment}
                  disabled={formSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300 disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving...' : 'Save Assignments'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
          disabled={formSubmitting}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-lg hover:shadow-soft transition-all duration-300 text-sm lg:text-base disabled:opacity-50"
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
                  disabled={(selectedEmployees || []).length === 0 || formSubmitting}
                  className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? 'Applying...' : `Apply (${(selectedEmployees || []).length})`}
                </button>
              </div>
              <button
                onClick={() => setSelectedEmployees((selectedEmployees || []).length === (employees || []).length ? [] : (employees || []).map(emp => emp?.Id))}
                className="text-sm text-primary hover:text-primary-dark"
              >
                {(selectedEmployees || []).length === (employees || []).length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            {/* Employee List for Attendance Marking */}
            <div className="grid gap-3">
              {(employees || []).map((employee) => {
                const todayStatus = getTodayAttendanceStatus(employee?.Id)
                const isSelected = (selectedEmployees || []).includes(employee?.Id)
                
                return (
                  <div
                    key={employee?.Id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        onChange={() => handleEmployeeSelection(employee?.Id)}
                        onChange={() => handleEmployeeSelection(employee.Id)}
                        className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                      />
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {employee.firstName?.[0]}{employee.lastName?.[0]}
                      </div>
                      <div>
                        <div className="font-medium text-surface-900 dark:text-white">
                          {employee?.firstName} {employee?.lastName}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-300">
                          {employee?.department}
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
                        onClick={() => markIndividualAttendance(employee?.Id, 'Present')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markIndividualAttendance(employee?.Id, 'Late')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
                      >
                        Late
                      </button>
                      <button
                        onClick={() => markIndividualAttendance(employee?.Id, 'Absent')}
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
      </h4>
      <div className="grid gap-4">
        {(attendance || []).map((record, index) => {
          const employee = (employees || []).find(emp => emp?.Id === record?.employeeId)
          return (
            <motion.div
              key={record?.Id}
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
                      {employee ? `${employee?.firstName} ${employee?.lastName}` : 'Unknown Employee'}
                    </h4>
                    <p className="text-surface-600 dark:text-surface-300 text-sm">
                      {record?.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'No date'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                    {record?.status}
                  </span>
                  <div className="text-surface-600 dark:text-surface-300 text-sm space-y-1">
                    In: {record?.checkIn || 'N/A'} {record?.checkOut && `• Out: ${record.checkOut}`}
                  </div>
                  <div className="text-surface-700 dark:text-surface-200 text-sm font-medium">
                    <span className="text-xs text-surface-500 dark:text-surface-400">Total Hours: </span>
                    <span className={`${calculateTotalHours(record?.checkIn, record?.checkOut) === 'In Progress' 
                      ? 'text-blue-600 dark:text-blue-400' : 'text-surface-900 dark:text-white'}`}>
                      {calculateTotalHours(record?.checkIn, record?.checkOut)}
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
        {(performanceReviews || []).map((review, index) => {
          const employee = (employees || []).find(emp => emp?.Id === review?.employeeId)
          return (
            <motion.div
              key={review?.Id}
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
                      {employee ? `${employee?.firstName} ${employee?.lastName}` : 'Unknown Employee'}
                    </h4>
                    <p className="text-surface-600 dark:text-surface-300 text-sm">
                      {review?.quarter} • {review?.reviewDate ? format(new Date(review.reviewDate), 'MMM dd, yyyy') : 'No date'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{review?.score}</div>
                  <div className="text-surface-600 dark:text-surface-300 text-sm">{review?.goals}</div>
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
                {tab?.count || 0}
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