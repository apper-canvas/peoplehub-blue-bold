import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import departmentService from '../services/departmentService'

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [formData, setFormData] = useState({ name: '' })
  const [submitting, setSubmitting] = useState(false)

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await departmentService.fetchDepartments()
      setDepartments(data || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
      setError('Failed to load departments. Please try again.')
      toast.error('Failed to load departments')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Department name is required')
      return
    }

    setSubmitting(true)
    try {
      await departmentService.createDepartment(formData)
      toast.success('Department created successfully')
      setShowCreateModal(false)
      setFormData({ name: '' })
      fetchDepartments()
    } catch (error) {
      console.error('Error creating department:', error)
      toast.error('Failed to create department')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Department name is required')
      return
    }

    setSubmitting(true)
    try {
      await departmentService.updateDepartment(selectedDepartment.Id, formData)
      toast.success('Department updated successfully')
      setShowEditModal(false)
      setSelectedDepartment(null)
      setFormData({ name: '' })
      fetchDepartments()
    } catch (error) {
      console.error('Error updating department:', error)
      toast.error('Failed to update department')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await departmentService.deleteDepartment(selectedDepartment.Id)
      toast.success('Department deleted successfully')
      setShowDeleteModal(false)
      setSelectedDepartment(null)
      fetchDepartments()
    } catch (error) {
      console.error('Error deleting department:', error)
      toast.error('Failed to delete department')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (department) => {
    setSelectedDepartment(department)
    setFormData({ name: department.Name || '' })
    setShowEditModal(true)
  }

  const openDeleteModal = (department) => {
    setSelectedDepartment(department)
    setShowDeleteModal(true)
  }

  const filteredDepartments = departments.filter(dept =>
    dept?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-soft mr-4">
                <ApperIcon name="Building2" className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
                  Departments
                </h1>
                <p className="text-surface-600 dark:text-surface-300 mt-1">
                  Manage your organization's departments
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-xl shadow-soft hover:shadow-card transition-all duration-300 flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="h-5 w-5" />
              Add Department
            </button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-surface-600 dark:text-surface-300">Loading departments...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl max-w-md mx-auto">
              <ApperIcon name="AlertCircle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Error Loading Data</h3>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={fetchDepartments}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="text-center py-16">
            <ApperIcon name="Building2" className="h-16 w-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
              {searchTerm ? 'No departments found' : 'No departments yet'}
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first department'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary text-white px-6 py-3 rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
              >
                Create Department
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredDepartments.map((department, index) => (
              <motion.div
                key={department.Id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl p-6 border border-surface-200/50 dark:border-surface-700/50 hover:shadow-card transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                    <ApperIcon name="Building2" className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(department)}
                      className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(department)}
                      className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  {department.Name || 'Unnamed Department'}
                </h3>
                
                <div className="space-y-2 text-sm text-surface-600 dark:text-surface-300">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                    <span>Created: {formatDate(department.CreatedOn)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="User" className="h-4 w-4" />
                    <span>Owner: {department.Owner || 'N/A'}</span>
                  </div>
                  {department.Tags && (
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Tag" className="h-4 w-4" />
                      <span className="text-xs bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded">
                        {department.Tags}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                Create New Department
              </h2>
              <form onSubmit={handleCreate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setFormData({ name: '' })
                    }}
                    className="flex-1 px-4 py-2 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                Edit Department
              </h2>
              <form onSubmit={handleEdit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedDepartment(null)
                      setFormData({ name: '' })
                    }}
                    className="flex-1 px-4 py-2 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <ApperIcon name="AlertTriangle" className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                  Delete Department
                </h2>
              </div>
              <p className="text-surface-600 dark:text-surface-300 mb-6">
                Are you sure you want to delete "{selectedDepartment?.Name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedDepartment(null)
                  }}
                  className="flex-1 px-4 py-2 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Departments