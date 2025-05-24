const { ApperClient } = window.ApperSDK

class AttendanceService {
  constructor() {
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'attendance1'
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'date', 'status', 'checkIn', 'checkOut', 'employeeId'
    ]
  }

  async fetchAttendance(params = {}) {
    try {
      const queryParams = {
        fields: this.fields,
        ...params
      }
      
      const response = await this.client.fetchRecords(this.tableName, queryParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching attendance:', error)
      throw error
    }
  }

  async getAttendanceById(attendanceId) {
    try {
      const params = {
        fields: this.fields
      }
      
      const response = await this.client.getRecordById(this.tableName, attendanceId, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching attendance with ID ${attendanceId}:`, error)
      throw error
    }
  }

  async createAttendance(attendanceData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: attendanceData.Name || `${attendanceData.employeeId}-${attendanceData.date}`,
        date: attendanceData.date,
        status: attendanceData.status,
        checkIn: attendanceData.checkIn || '',
        checkOut: attendanceData.checkOut || '',
        employeeId: attendanceData.employeeId
      }

      // Remove undefined values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === undefined) {
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
          throw new Error(result.message || 'Failed to create attendance record')
        }
      }
      
      throw new Error('Failed to create attendance record')
    } catch (error) {
      console.error('Error creating attendance:', error)
      throw error
    }
  }

  async updateAttendance(attendanceId, attendanceData) {
    try {
      // Only include updateable fields plus ID
      const updateableData = {
        Id: attendanceId,
        Name: attendanceData.Name || `${attendanceData.employeeId}-${attendanceData.date}`,
        date: attendanceData.date,
        status: attendanceData.status,
        checkIn: attendanceData.checkIn,
        checkOut: attendanceData.checkOut,
        employeeId: attendanceData.employeeId
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
          throw new Error(result.message || 'Failed to update attendance record')
        }
      }
      
      throw new Error('Failed to update attendance record')
    } catch (error) {
      console.error('Error updating attendance:', error)
      throw error
    }
  }

  async deleteAttendance(attendanceId) {
    try {
      const params = {
        RecordIds: [attendanceId]
      }

      const response = await this.client.deleteRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        return result.success
      }
      
      return false
    } catch (error) {
      console.error('Error deleting attendance:', error)
      throw error
    }
  }

  async getAttendanceByEmployee(employeeId, dateRange = {}) {
    try {
      const whereConditions = [
        {
          fieldName: 'employeeId',
          operator: 'EqualTo',
          values: [employeeId]
        }
      ]

      if (dateRange.start && dateRange.end) {
        whereConditions.push({
          fieldName: 'date',
          operator: 'GreaterThanOrEqualTo',
          values: [dateRange.start]
        })
        whereConditions.push({
          fieldName: 'date',
          operator: 'LessThanOrEqualTo',
          values: [dateRange.end]
        })
      }

      const params = {
        fields: this.fields,
        where: whereConditions
      }
      
      const response = await this.client.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching employee attendance:', error)
      throw error
    }
  }
}

export default new AttendanceService()