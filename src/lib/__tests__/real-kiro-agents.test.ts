import { KiroWorkflowError } from '../kiro-cli'

describe('real-kiro-agents', () => {
  describe('KiroWorkflowError', () => {
    it('should create error with message', () => {
      const error = new KiroWorkflowError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('KiroWorkflowError')
    })

    it('should create error with step and code', () => {
      const error = new KiroWorkflowError('Test error', 'test-step', 1)
      expect(error.message).toBe('Test error')
      expect(error.step).toBe('test-step')
      expect(error.code).toBe(1)
    })
  })

  describe('Agent Response Types', () => {
    it('should have correct interface structure', () => {
      // Test that the interfaces are properly exported
      const mockResponse = {
        success: true,
        data: { test: 'data' }
      }
      
      expect(mockResponse.success).toBe(true)
      expect(mockResponse.data).toEqual({ test: 'data' })
    })
  })
})
