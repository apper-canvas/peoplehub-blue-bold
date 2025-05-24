import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
)

const AnalyticsCharts = ({ type, data, dateRange }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8
      }
    }
  }

  const renderChart = () => {
    switch (type) {
      case 'attendance':
        return (
          <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 dark:border-surface-700/50">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Attendance Rate Trend
            </h3>
            <div className="h-64">
              <Line
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'This Week',
                      data: data.thisWeek,
                      borderColor: '#10B981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      tension: 0.4,
                      fill: true
                    },
                    {
                      label: 'Last Week',
                      data: data.lastWeek,
                      borderColor: '#6B7280',
                      backgroundColor: 'rgba(107, 114, 128, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        )

      case 'performance':
        return (
          <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 dark:border-surface-700/50">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Performance Trends
            </h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                  datasets: [
                    {
                      label: 'Average Performance Score',
                      data: data.quarterly,
                      backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                      ],
                      borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(139, 92, 246)'
                      ],
                      borderWidth: 2,
                      borderRadius: 6
                    }
                  ]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        )

      case 'attendanceDetailed':
        return (
          <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 dark:border-surface-700/50">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Detailed Attendance Analysis
            </h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                  datasets: [
                    {
                      label: 'Present',
                      data: [94, 92, 96, 91],
                      backgroundColor: 'rgba(16, 185, 129, 0.8)',
                      borderColor: 'rgb(16, 185, 129)',
                      borderWidth: 2
                    },
                    {
                      label: 'Late',
                      data: [4, 6, 2, 7],
                      backgroundColor: 'rgba(245, 158, 11, 0.8)',
                      borderColor: 'rgb(245, 158, 11)',
                      borderWidth: 2
                    },
                    {
                      label: 'Absent',
                      data: [2, 2, 2, 2],
                      backgroundColor: 'rgba(239, 68, 68, 0.8)',
                      borderColor: 'rgb(239, 68, 68)',
                      borderWidth: 2
                    }
                  ]
                }}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    x: {
                      ...chartOptions.scales.x,
                      stacked: true
                    },
                    y: {
                      ...chartOptions.scales.y,
                      stacked: true
                    }
                  }
                }}
              />
            </div>
          </div>
        )

      case 'departmentAttendance':
        const departments = [...new Set(data.map(emp => emp.department))]
        const deptAttendance = departments.map(dept => {
          const deptEmps = data.filter(emp => emp.department === dept)
          return deptEmps.reduce((sum, emp) => sum + emp.attendance, 0) / deptEmps.length
        })

        return (
          <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 dark:border-surface-700/50">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Department Attendance
            </h3>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: departments,
                  datasets: [
                    {
                      data: deptAttendance,
                      backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
                      ],
                      borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(139, 92, 246)',
                        'rgb(236, 72, 153)'
                      ],
                      borderWidth: 2
                    }
                  ]
                }}
                options={pieOptions}
              />
            </div>
          </div>
        )

      case 'performanceTrends':
        return (
          <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 dark:border-surface-700/50">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Performance Score Trends
            </h3>
            <div className="h-64">
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Company Average',
                      data: [4.1, 4.2, 4.0, 4.3, 4.4, 4.3],
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        )

      case 'departmentPerformance':
        return (
          <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 dark:border-surface-700/50">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Department Performance
            </h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: Object.keys(data),
                  datasets: [
                    {
                      label: 'Average Score',
                      data: Object.values(data),
                      backgroundColor: 'rgba(139, 92, 246, 0.8)',
                      borderColor: 'rgb(139, 92, 246)',
                      borderWidth: 2,
                      borderRadius: 6
                    }
                  ]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        )

      default:
        return <div>Chart type not supported</div>
    }
  }

  return renderChart()
}

export default AnalyticsCharts