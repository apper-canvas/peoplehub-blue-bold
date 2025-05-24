const { ApperClient } = window.ApperSDK

class ProjectService {
  constructor() {
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'project4'
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'status', 'progress', 'endDate', 'description'
    ]
  }

  async fetchProjects(params = {}) {
    try {
      const queryParams = {
        fields: this.fields,
        ...params
      }
      
      const response = await this.client.fetchRecords(this.tableName, queryParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }

  async getProjectById(projectId) {
    try {
      const params = {
        fields: this.fields
      }
      
      const response = await this.client.getRecordById(this.tableName, projectId, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching project with ID ${projectId}:`, error)
      throw error
    }
  }

  async createProject(projectData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: projectData.name || projectData.Name,
        status: projectData.status || 'Planning',
        progress: projectData.progress || 0,
        endDate: projectData.endDate,
        description: projectData.description || ''
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
          throw new Error(result.message || 'Failed to create project')
        }
      }
      
      throw new Error('Failed to create project')
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  async updateProject(projectId, projectData) {
    try {
      // Only include updateable fields plus ID
      const updateableData = {
        Id: projectId,
        Name: projectData.name || projectData.Name,
        status: projectData.status,
        progress: projectData.progress,
        endDate: projectData.endDate,
        description: projectData.description
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
          throw new Error(result.message || 'Failed to update project')
        }
      }
      
      throw new Error('Failed to update project')
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  async deleteProject(projectId) {
    try {
      const params = {
        RecordIds: [projectId]
      }

      const response = await this.client.deleteRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        return result.success
      }
      
      return false
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  async searchProjects(searchTerm) {
    try {
      const params = {
        fields: this.fields,
        where: [
          {
            fieldName: 'Name',
            operator: 'Contains',
            values: [searchTerm]
          }
        ]
      }
      
      const response = await this.client.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error searching projects:', error)
      throw error
    }
  }
}

export default new ProjectService()