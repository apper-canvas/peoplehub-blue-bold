const { ApperClient } = window.ApperSDK

class ProjectAssignmentService {
  constructor() {
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'project_assignment'
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'employeeId', 'projectId'
    ]
  }

  async fetchProjectAssignments(params = {}) {
    try {
      const queryParams = {
        fields: this.fields,
        ...params
      }
      
      const response = await this.client.fetchRecords(this.tableName, queryParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching project assignments:', error)
      throw error
    }
  }

  async getAssignmentsByProject(projectId) {
    try {
      const params = {
        fields: this.fields,
        where: [
          {
            fieldName: 'projectId',
            operator: 'EqualTo',
            values: [projectId]
          }
        ]
      }
      
      const response = await this.client.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching project assignments:', error)
      throw error
    }
  }

  async getAssignmentsByEmployee(employeeId) {
    try {
      const params = {
        fields: this.fields,
        where: [
          {
            fieldName: 'employeeId',
            operator: 'EqualTo',
            values: [employeeId]
          }
        ]
      }
      
      const response = await this.client.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching employee assignments:', error)
      throw error
    }
  }

  async createProjectAssignment(assignmentData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: assignmentData.Name || `${assignmentData.projectId}-${assignmentData.employeeId}`,
        employeeId: assignmentData.employeeId,
        projectId: assignmentData.projectId
      }

      const params = {
        records: [updateableData]
      }

      const response = await this.client.createRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message || 'Failed to create project assignment')
        }
      }
      
      throw new Error('Failed to create project assignment')
    } catch (error) {
      console.error('Error creating project assignment:', error)
      throw error
    }
  }

  async updateProjectAssignments(projectId, employeeIds) {
    try {
      // First, remove all existing assignments for this project
      const existingAssignments = await this.getAssignmentsByProject(projectId)
      
      if (existingAssignments.length > 0) {
        const deleteParams = {
          RecordIds: existingAssignments.map(assignment => assignment.Id)
        }
        await this.client.deleteRecord(this.tableName, deleteParams)
      }
      
      // Then create new assignments
      if (employeeIds.length > 0) {
        const assignmentRecords = employeeIds.map(employeeId => ({
          Name: `${projectId}-${employeeId}`,
          employeeId: employeeId,
          projectId: projectId
        }))
        
        const params = {
          records: assignmentRecords
        }
        
        const response = await this.client.createRecord(this.tableName, params)
        
        if (response?.success) {
          return response.results?.filter(result => result.success) || []
        }
      }
      
      return []
    } catch (error) {
      console.error('Error updating project assignments:', error)
      throw error
    }
  }

  async deleteProjectAssignment(assignmentId) {
    try {
      const params = {
        RecordIds: [assignmentId]
      }

      const response = await this.client.deleteRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        return result.success
      }
      
      return false
    } catch (error) {
      console.error('Error deleting project assignment:', error)
      throw error
    }
  }
}

export default new ProjectAssignmentService()