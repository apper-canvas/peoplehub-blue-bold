const { ApperClient } = window.ApperSDK

class EmployeeService {
  constructor() {
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'employee3'
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'firstName', 'lastName', 'email', 'department', 'position', 'status', 'hireDate'
    ]
  }

  async fetchEmployees(params = {}) {
    try {
      const queryParams = {
        fields: this.fields,
        ...params
      }
      
      const response = await this.client.fetchRecords(this.tableName, queryParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching employees:', error)
      throw error
    }
  }

  async getEmployeeById(employeeId) {
    try {
      const params = {
        fields: this.fields
      }
      
      const response = await this.client.getRecordById(this.tableName, employeeId, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching employee with ID ${employeeId}:`, error)
      throw error
    }
  }

  async createEmployee(employeeData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: employeeData.Name || `${employeeData.firstName} ${employeeData.lastName}`,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        department: employeeData.department,
        position: employeeData.position,
        status: employeeData.status || 'Active',
        hireDate: employeeData.hireDate || new Date().toISOString().split('T')[0]
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
          throw new Error(result.message || 'Failed to create employee')
        }
      }
      
      throw new Error('Failed to create employee')
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    }
  }

  async updateEmployee(employeeId, employeeData) {
    try {
      // Only include updateable fields plus ID
      const updateableData = {
        Id: employeeId,
        Name: employeeData.Name || `${employeeData.firstName} ${employeeData.lastName}`,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        department: employeeData.department,
        position: employeeData.position,
        status: employeeData.status
      }

      // Remove undefined values but keep empty strings for clearing fields
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === undefined) {
          delete updateableData[key]
        }
      })

      const params = {
        records: [updateableData]
      }

      const response = await this.client.updateRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message || 'Failed to update employee')
        }
      }
      
      throw new Error('Failed to update employee')
    } catch (error) {
      console.error('Error updating employee:', error)
      throw error
    }
  }

  async deleteEmployee(employeeId) {
    try {
      const params = {
        RecordIds: [employeeId]
      }

      const response = await this.client.deleteRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        return result.success
      }
      
      return false
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    }
  }

  async searchEmployees(searchTerm) {
    try {
      const params = {
        fields: this.fields,
        where: [
          {
            fieldName: 'firstName',
            operator: 'Contains',
            values: [searchTerm]
          }
        ]
      }
      
      const response = await this.client.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error searching employees:', error)
      throw error
    }
  }
}

export default new EmployeeService()