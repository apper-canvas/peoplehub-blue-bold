const { ApperClient } = window.ApperSDK

class PerformanceService {
  constructor() {
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'performance_review'
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'quarter', 'score', 'reviewDate', 'goals', 'employeeId'
    ]
  }

  async fetchPerformanceReviews(params = {}) {
    try {
      const queryParams = {
        fields: this.fields,
        ...params
      }
      
      const response = await this.client.fetchRecords(this.tableName, queryParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching performance reviews:', error)
      throw error
    }
  }

  async getPerformanceReviewById(reviewId) {
    try {
      const params = {
        fields: this.fields
      }
      
      const response = await this.client.getRecordById(this.tableName, reviewId, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching performance review with ID ${reviewId}:`, error)
      throw error
    }
  }

  async createPerformanceReview(reviewData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: reviewData.Name || `${reviewData.quarter}-${reviewData.employeeId}`,
        quarter: reviewData.quarter,
        score: parseFloat(reviewData.score),
        reviewDate: reviewData.reviewDate,
        goals: reviewData.goals || '',
        employeeId: reviewData.employeeId
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
          throw new Error(result.message || 'Failed to create performance review')
        }
      }
      
      throw new Error('Failed to create performance review')
    } catch (error) {
      console.error('Error creating performance review:', error)
      throw error
    }
  }

  async updatePerformanceReview(reviewId, reviewData) {
    try {
      // Only include updateable fields plus ID
      const updateableData = {
        Id: reviewId,
        Name: reviewData.Name || `${reviewData.quarter}-${reviewData.employeeId}`,
        quarter: reviewData.quarter,
        score: parseFloat(reviewData.score),
        reviewDate: reviewData.reviewDate,
        goals: reviewData.goals,
        employeeId: reviewData.employeeId
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
          throw new Error(result.message || 'Failed to update performance review')
        }
      }
      
      throw new Error('Failed to update performance review')
    } catch (error) {
      console.error('Error updating performance review:', error)
      throw error
    }
  }

  async deletePerformanceReview(reviewId) {
    try {
      const params = {
        RecordIds: [reviewId]
      }

      const response = await this.client.deleteRecord(this.tableName, params)
      
      if (response?.success && response?.results?.length > 0) {
        const result = response.results[0]
        return result.success
      }
      
      return false
    } catch (error) {
      console.error('Error deleting performance review:', error)
      throw error
    }
  }

  async getPerformanceByEmployee(employeeId) {
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
      console.error('Error fetching employee performance:', error)
      throw error
    }
  }
}

export default new PerformanceService()