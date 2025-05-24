const { ApperClient } = window.ApperSDK

class DepartmentService {
  constructor() {
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'department3'
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
    ]
  }

  async fetchDepartments(params = {}) {
    try {
      const queryParams = {
        fields: this.fields,
        ...params
      }
      
      const response = await this.client.fetchRecords(this.tableName, queryParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching departments:', error)
      throw error
    }
  }

  async getDepartmentById(departmentId) {
    try {
      const params = {
        fields: this.fields
      }
      
      const response = await this.client.getRecordById(this.tableName, departmentId, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching department with ID ${departmentId}:`, error)
      throw error
    }
  }

  async createDepartment(departmentData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: departmentData.name || departmentData.Name
      }

      // Remove undefined values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === undefined || updateableData[key] === '') {
          delete updateableData[key]
        }
      })

      const params = {
        records: [updateableData]
      }

      const response = await this.client.createRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message || 'Failed to create department')
        }
      }
      
      throw new Error('Failed to create department')
    } catch (error) {
      console.error('Error creating department:', error)
      throw error
    }
  }

  async updateDepartment(departmentId, departmentData) {
    try {
      // Only include updateable fields plus ID
      const updateableData = {
        Id: departmentId,
        Name: departmentData.name || departmentData.Name
      }

      const params = {
        records: [updateableData]
      }

      const response = await this.client.updateRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message || 'Failed to update department')
        }
      }
      
      throw new Error('Failed to update department')
    } catch (error) {
      console.error('Error updating department:', error)
      throw error
    }
  }

  async deleteDepartment(departmentId) {
    try {
      const params = {
        RecordIds: [departmentId]
      }

      const response = await this.client.deleteRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        return result.success
      }
      
      return false
    } catch (error) {
      console.error('Error deleting department:', error)
      throw error
    }
  }
}

export default new DepartmentService()