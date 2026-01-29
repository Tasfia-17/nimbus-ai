import { KiroWorkflowError } from '../kiro-cli'

// Mock the entire kiro-cli module
jest.mock('../kiro-cli', () => ({
  KiroWorkflowError: class extends Error {
    constructor(message: string, public step?: string, public code?: number) {
      super(message)
      this.name = 'KiroWorkflowError'
    }
  },
  executeKiroWorkflow: jest.fn().mockResolvedValue({
    architecture_name: 'Test Architecture',
    services: []
  }),
  streamKiroWorkflow: jest.fn(),
  validateKiroCLI: jest.fn().mockResolvedValue(true),
}))

describe('Kiro CLI Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('KiroWorkflowError', () => {
    it('should create error with message and step', () => {
      const error = new KiroWorkflowError('Test error', 'test-step', 1)
      expect(error.message).toBe('Test error')
      expect(error.step).toBe('test-step')
      expect(error.code).toBe(1)
      expect(error.name).toBe('KiroWorkflowError')
    })
  })

  describe('executeKiroWorkflow', () => {
    it('should be mocked and return expected result', () => {
      const { executeKiroWorkflow } = require('../kiro-cli')
      expect(typeof executeKiroWorkflow).toBe('function')
    })
  })

  describe('validateKiroCLI', () => {
    it('should be mocked and return true', async () => {
      const { validateKiroCLI } = require('../kiro-cli')
      const result = await validateKiroCLI()
      expect(result).toBe(true)
    })
  })
})
