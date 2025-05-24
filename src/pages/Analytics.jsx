import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import AnalyticsCharts from '../components/AnalyticsCharts'

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('month')
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportSchedule, setReportSchedule] = useState({
    frequency: 'weekly',
    email: '',
    enabled: false
  })

  // Sample data for analytics
  const [analyticsData, setAnalyticsData] = useState({
    employees: [
      { id: '1', name: 'Sarah Johnson', department: 'Engineering', attendance: 95, performance: 4.5, projects: 3 },
      { id: '2', name: 'Michael Chen', department: 'Design', attendance: 88, performance: 4.2, projects: 2 },
      { id: '3', name: 'Emily Davis', department: 'Marketing', attendance: 92, performance: 4.0, projects: 4 },
      { id: '4', name: 'James Wilson', department: 'Engineering', attendance: 97, performance: 4.8, projects: 2 },
      { id: '5', name: 'Lisa Anderson', department: 'HR', attendance: 94, performance: 4.3, projects: 1 }
    ],
    projects: [
      { id: '1', name: 'Mobile App Redesign', completion: 75, team: 5, deadline: '2024-12-31' },
      { id: '2', name: 'HR Dashboard', completion: 25, team: 3, deadline: '2024-11-15' },
      { id: '3', name: 'Marketing Campaign', completion: 90, team: 4, deadline: '2024-10-30' },
      { id: '4', name: 'System Upgrade', completion: 60, team: 6, deadline: '2024-12-15' }
    ],
    attendance: {
      thisWeek: [95, 88, 92, 97, 94, 89, 91],
      lastWeek: [92, 85, 88, 94, 91, 87, 89],
      thisMonth: 92.5,
      lastMonth: 89.2
    },
    performance: {
      quarterly: [4.1, 4.3, 4.2, 4.4],
      byDepartment: {
        Engineering: 4.65,
        Design: 4.2,
        Marketing: 4.0,
        HR: 4.3,
        Sales: 4.1
      }
    }
  })

  const [kpis, setKpis] = useState({
    totalEmployees: 247,
    attendanceRate: 92.5,
    projectCompletionRate: 62.5,
    avgPerformanceScore: 4.3,
    activeProjects: 12,
    departmentCount: 6
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'attendance', label: 'Attendance Analytics', icon: 'Clock' },
    { id: 'performance', label: 'Performance Metrics', icon: 'BarChart3' },
    { id: 'projects', label: 'Project Analytics', icon: 'Briefcase' },
    { id: 'reports', label: 'Reports & Export', icon: 'FileText' }
  ]

  const handleScheduleReport = () => {
    if (!reportSchedule.email) {
      toast.error('Please enter an email address')
      return
    }
    
    // Simulate scheduling the report
    toast.success(`Report scheduled ${reportSchedule.frequency} to ${reportSchedule.email}`)
    setShowReportModal(false)
    setReportSchedule({ ...reportSchedule, enabled: true })
  }

  const handleExportData = (format) => {
    // Simulate data export
    toast.success(`Exporting data as ${format.toUpperCase()}...`)
    
    // In a real application, you would generate and download the file
    setTimeout(() => {
      toast.success(`${format.toUpperCase()} file downloaded successfully!`)
    }, 2000)
  }

  const generateReport = (type) => {
    toast.success(`Generating ${type} report...`)
    
    // Simulate report generation
    setTimeout(() => {
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