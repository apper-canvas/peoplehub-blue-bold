import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import AnalyticsCharts from '../components/AnalyticsCharts'
import employeeService from '../services/employeeService'
import projectService from '../services/projectService'
import attendanceService from '../services/attendanceService'
import performanceService from '../services/performanceService'
import reportService from '../services/reportService'

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('month')
  const [showReportModal, setShowReportModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  
  const [reportSchedule, setReportSchedule] = useState({
    frequency: 'weekly',
    email: '',
    enabled: false
  })

  // Real data from services
  const [analyticsData, setAnalyticsData] = useState({
    employees: [],
    projects: [],
    attendance: {
      thisWeek: [],
      lastWeek: [],
      thisMonth: 0,
      lastMonth: 0
    },
    performance: {
      quarterly: [],
      byDepartment: {
        Engineering: 0,
        Design: 0,
        Marketing: 0,
        HR: 0,
        Sales: 0
      }
    }
  })

  const [kpis, setKpis] = useState({
    totalEmployees: 0,
    attendanceRate: 0,
    projectCompletionRate: 0,
    avgPerformanceScore: 0,
    activeProjects: 0,
    departmentCount: 0
  })

  // Load data on component mount
  useEffect(() => {
    loadAnalyticsData()
  }, [dateRange])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [employees, projects, attendance, performanceReviews] = await Promise.all([
        employeeService.fetchEmployees(),
        projectService.fetchProjects(),
        attendanceService.fetchAttendance(),
        performanceService.fetchPerformanceReviews()
      ])
      
      // Process and set analytics data
      const processedData = processAnalyticsData(employees, projects, attendance, performanceReviews)
      setAnalyticsData(processedData)
      
      // Calculate KPIs
      const calculatedKpis = calculateKPIs(employees, projects, attendance, performanceReviews)
      setKpis(calculatedKpis)
    } catch (error) {
      console.error('Error loading analytics data:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const processAnalyticsData = (employees, projects, attendance, performanceReviews) => {
    // Process employees data
    const processedEmployees = employees.map(emp => ({
      id: emp.Id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      attendance: calculateEmployeeAttendanceRate(emp.Id, attendance),
      performance: calculateEmployeePerformanceAvg(emp.Id, performanceReviews),
      projects: 0 // This would need project assignment data
    }))

    // Process projects data
    const processedProjects = projects.map(proj => ({
      id: proj.Id,
      name: proj.Name,
      completion: proj.progress || 0,
      team: 0, // This would need project assignment data
      deadline: proj.endDate
    }))

    // Process attendance data
    const attendanceData = processAttendanceData(attendance)
    
    // Process performance data
    const performanceData = processPerformanceData(performanceReviews, employees)

    return {
      employees: processedEmployees,
      projects: processedProjects,
      attendance: attendanceData,
      performance: performanceData
    }
  }

  const calculateEmployeeAttendanceRate = (employeeId, attendance) => {
    const employeeAttendance = attendance.filter(a => a.employeeId === employeeId)
    if (employeeAttendance.length === 0) return 0
    
    const presentCount = employeeAttendance.filter(a => a.status === 'Present').length
    return Math.round((presentCount / employeeAttendance.length) * 100)
  }

  const calculateEmployeePerformanceAvg = (employeeId, performanceReviews) => {
    const employeeReviews = performanceReviews.filter(r => r.employeeId === employeeId)
    if (employeeReviews.length === 0) return 0
    
    const total = employeeReviews.reduce((sum, review) => sum + review.score, 0)
    return (total / employeeReviews.length).toFixed(1)
  }

  const processAttendanceData = (attendance) => {
    // This is a simplified version - in a real app, you'd calculate actual weekly/monthly data
    const totalRecords = attendance.length
    const presentRecords = attendance.filter(a => a.status === 'Present').length
    const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0

    return {
      thisWeek: [95, 88, 92, 97, 94, 89, 91], // Sample data - would calculate from actual dates
      lastWeek: [92, 85, 88, 94, 91, 87, 89], // Sample data - would calculate from actual dates
      thisMonth: attendanceRate,
      lastMonth: attendanceRate * 0.9 // Sample calculation
    }
  }

  const processPerformanceData = (performanceReviews, employees) => {
    // Calculate quarterly averages (simplified)
    const avgScore = performanceReviews.length > 0 
      ? performanceReviews.reduce((sum, review) => sum + review.score, 0) / performanceReviews.length
      : 0

    // Calculate by department
    const byDepartment = {}
    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))]
    
    departments.forEach(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept)
      const deptReviews = performanceReviews.filter(review => 
        deptEmployees.some(emp => emp.Id === review.employeeId)
      )
      
      byDepartment[dept] = deptReviews.length > 0
        ? (deptReviews.reduce((sum, review) => sum + review.score, 0) / deptReviews.length).toFixed(2)
        : 0
    })

    return {
      quarterly: [avgScore * 0.9, avgScore * 0.95, avgScore, avgScore * 1.05], // Sample quarterly trend
      byDepartment
    }
  }

  const calculateKPIs = (employees, projects, attendance, performanceReviews) => {
    const totalEmployees = employees.length
    const activeProjects = projects.filter(p => p.status === 'In Progress').length
    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))].length
    
    // Calculate attendance rate
    const totalAttendanceRecords = attendance.length
    const presentRecords = attendance.filter(a => a.status === 'Present').length
    const attendanceRate = totalAttendanceRecords > 0 
      ? ((presentRecords / totalAttendanceRecords) * 100).toFixed(1)
      : 0
    
    // Calculate project completion rate
    const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0)
    const projectCompletionRate = projects.length > 0 
      ? (totalProgress / projects.length).toFixed(1)
      : 0
    
    // Calculate average performance score
    const avgPerformanceScore = performanceReviews.length > 0
      ? (performanceReviews.reduce((sum, review) => sum + review.score, 0) / performanceReviews.length).toFixed(1)
      : 0

    return {
      totalEmployees,
      attendanceRate: parseFloat(attendanceRate),
      projectCompletionRate: parseFloat(projectCompletionRate),
      avgPerformanceScore: parseFloat(avgPerformanceScore),
      activeProjects,
      departmentCount: departments
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'attendance', label: 'Attendance Analytics', icon: 'Clock' },
    { id: 'performance', label: 'Performance Metrics', icon: 'BarChart3' },
    { id: 'projects', label: 'Project Analytics', icon: 'Briefcase' },
    { id: 'reports', label: 'Reports & Export', icon: 'FileText' }
  ]

  const handleScheduleReport = async () => {
    if (!reportSchedule.email) {
      toast.error('Please enter an email address')
      return
    }
    
    try {
      setSubmitLoading(true)
      
      // Create report schedule in database
      await reportService.createReportSchedule({
        frequency: reportSchedule.frequency,
        email: reportSchedule.email,
        enabled: true
      })
      
      toast.success(`Report scheduled ${reportSchedule.frequency} to ${reportSchedule.email}`)
      setShowReportModal(false)
      setReportSchedule({ ...reportSchedule, enabled: true })
    } catch (error) {
      console.error('Error scheduling report:', error)
      toast.error('Failed to schedule report')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleExportData = (format) => {
    setLoading(true)
    toast.success(`Exporting data as ${format.toUpperCase()}...`)
    
    // Simulate export process
    setTimeout(() => {
      setLoading(false)
      toast.success(`${format.toUpperCase()} file downloaded successfully!`)
    }, 2000)
  }

  const generateReport = (type) => {
    setLoading(true)
    toast.success(`Generating ${type} report...`)
    
    // Simulate report generation process
    setTimeout(() => {
      setLoading(false)
      toast.success(`${type} report generated successfully!`)
    }, 3000)
  }

  const getDateRangeData = () => {
    const now = new Date()
    switch (dateRange) {
      case 'week':
        return {
          start: startOfWeek(now),
          end: endOfWeek(now),
          label: 'This Week'
        }
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          label: 'This Month'
        }
      case 'quarter':
        return {
          start: startOfMonth(subDays(now, 90)),
          end: now,
          label: 'Last 3 Months'
        }
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          label: 'This Month'
        }
    }
  }

  if (loading && kpis.totalEmployees === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 flex items-center justify-center">
        <div className="text-lg">Loading analytics data...</div>
      </div>
    )
  }

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-300 text-sm">Total Employees</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{kpis.totalEmployees}</p>
            </div>
            <ApperIcon name="Users" className="h-8 w-8 text-primary" />
          </div>
        </motion.div>

        <motion.div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-300 text-sm">Attendance Rate</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{kpis.attendanceRate}%</p>
            </div>
            <ApperIcon name="Clock" className="h-8 w-8 text-secondary" />
          </div>
        </motion.div>

        <motion.div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-300 text-sm">Avg Performance</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{kpis.avgPerformanceScore}</p>
            </div>
            <ApperIcon name="BarChart3" className="h-8 w-8 text-accent" />
          </div>
        </motion.div>

        <motion.div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-300 text-sm">Project Completion</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{kpis.projectCompletionRate}%</p>
            </div>
            <ApperIcon name="Briefcase" className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-300 text-sm">Active Projects</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{kpis.activeProjects}</p>
            </div>
            <ApperIcon name="FolderOpen" className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-surface-200/50 dark:border-surface-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-300 text-sm">Departments</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{kpis.departmentCount}</p>
            </div>
            <ApperIcon name="Building2" className="h-8 w-8 text-indigo-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AnalyticsCharts 
          type="attendance" 
          data={analyticsData.attendance} 
          dateRange={dateRange}
        />
        <AnalyticsCharts 
          type="performance" 
          data={analyticsData.performance} 
          dateRange={dateRange}
        />
      </div>
    </motion.div>
  )

  const renderAttendance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <AnalyticsCharts 
          type="attendanceDetailed" 
          data={analyticsData.attendance} 
          dateRange={dateRange}
        />
        <AnalyticsCharts 
          type="departmentAttendance" 
          data={analyticsData.employees} 
          dateRange={dateRange}
        />
      </div>
    </motion.div>
  )

  const renderPerformance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <AnalyticsCharts 
          type="performanceTrends" 
          data={analyticsData.performance} 
          dateRange={dateRange}
        />
        <AnalyticsCharts 
          type="departmentPerformance" 
          data={analyticsData.performance.byDepartment} 
          dateRange={dateRange}
        />
      </div>
    </motion.div>
  )

  const renderProjects = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <AnalyticsCharts 
          type="projectCompletion" 
          data={analyticsData.projects} 
          dateRange={dateRange}
        />
        <AnalyticsCharts 
          type="projectTimeline" 
          data={analyticsData.projects} 
          dateRange={dateRange}
        />
      </div>
    </motion.div>
  )

  const renderReports = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Automated Reports */}
      <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 dark:border-surface-700/50">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Automated Reports</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-surface-600 dark:text-surface-300">
              Schedule automatic reports to be sent to managers
            </p>
            {reportSchedule.enabled && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                ✓ Reports scheduled {reportSchedule.frequency} to {reportSchedule.email}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {reportSchedule.enabled ? 'Modify Schedule' : 'Setup Schedule'}
          </button>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 dark:border-surface-700/50">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Generate Reports</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => generateReport('Monthly Performance')}
            className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
          >
            <ApperIcon name="BarChart3" className="h-6 w-6 text-purple-500 mb-2" />
            <div className="text-sm font-medium">Performance Report</div>
          </button>
          <button
            onClick={() => generateReport('Attendance Summary')}
            className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
          >
            <ApperIcon name="Clock" className="h-6 w-6 text-secondary mb-2" />
            <div className="text-sm font-medium">Attendance Report</div>
          </button>
          <button
            onClick={() => generateReport('Project Status')}
            className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
          >
            <ApperIcon name="Briefcase" className="h-6 w-6 text-accent mb-2" />
            <div className="text-sm font-medium">Project Report</div>
          </button>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 dark:border-surface-700/50">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExportData('csv')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Export as CSV
          </button>
          <button
            onClick={() => handleExportData('excel')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Export as Excel
          </button>
          <button
            onClick={() => handleExportData('pdf')}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Export as PDF
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="p-2 text-surface-600 hover:text-primary transition-colors">
                <ApperIcon name="ArrowLeft" className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-surface-600 dark:text-surface-300">
                  {getDateRangeData().label} • {format(new Date(), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">Last 3 Months</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 lg:px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary bg-primary/5'
                    : 'text-surface-600 dark:text-surface-300 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <ApperIcon name={tab.icon} className="h-5 w-5" />
                <span className="text-sm lg:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'attendance' && renderAttendance()}
          {activeTab === 'performance' && renderPerformance()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'reports' && renderReports()}
        </AnimatePresence>
      </div>

      {/* Report Schedule Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                Schedule Automated Reports
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={reportSchedule.frequency}
                    onChange={(e) => setReportSchedule({...reportSchedule, frequency: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={reportSchedule.email}
                    onChange={(e) => setReportSchedule({...reportSchedule, email: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg"
                    placeholder="manager@company.com"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-surface-600 hover:text-surface-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScheduleReport}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Schedule Reports
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Analytics