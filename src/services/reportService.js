const { ApperClient } = window.ApperSDK

class ReportService {
  constructor() {
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'report_schedule'
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'frequency', 'email', 'enabled'
    ]
  }

  async fetchReportSchedules(params = {}) {
    try {
      const queryParams = {
        fields: this.fields,
        ...params
      }
      
      const response = await this.client.fetchRecords(this.tableName, queryParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching report schedules:', error)
      throw error
    }
  }

  async getReportScheduleById(scheduleId) {
    try {
      const params = {
        fields: this.fields
      }
      
      const response = await this.client.getRecordById(this.tableName, scheduleId, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching report schedule with ID ${scheduleId}:`, error)
      throw error
    }
  }

  async createReportSchedule(scheduleData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: scheduleData.Name || `${scheduleData.frequency}-${scheduleData.email}`,
        frequency: scheduleData.frequency,
        email: scheduleData.email,
        enabled: scheduleData.enabled || false
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
          throw new Error(result.message || 'Failed to create report schedule')
        }
      }
      
      throw new Error('Failed to create report schedule')
    } catch (error) {
      console.error('Error creating report schedule:', error)
      throw error
    }
  }

  async updateReportSchedule(scheduleId, scheduleData) {
    try {
      // Only include updateable fields plus ID
      const updateableData = {
        Id: scheduleId,
        Name: scheduleData.Name || `${scheduleData.frequency}-${scheduleData.email}`,
        frequency: scheduleData.frequency,
        email: scheduleData.email,
        enabled: scheduleData.enabled
      }

      // Remove undefined values but keep false for boolean fields
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
          throw new Error(result.message || 'Failed to update report schedule')
        }
      }
      
      throw new Error('Failed to update report schedule')
    } catch (error) {
      console.error('Error updating report schedule:', error)
      throw error
    }
  }

  async deleteReportSchedule(scheduleId) {
    try {
      const params = {
        RecordIds: [scheduleId]
      }

      const response = await this.client.deleteRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        return result.success
      }
      
      return false
    } catch (error) {
      console.error('Error deleting report schedule:', error)
      throw error
    }
  }
}

export default new ReportService()