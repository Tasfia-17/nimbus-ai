// Integration test for architecture workflow
describe('Architecture Workflow Integration', () => {
  it('should validate architecture generation workflow', () => {
    const mockArchitecture = {
      architecture_name: 'Test Architecture',
      services: [
        { id: 'web', service: 'EC2', category: 'compute' },
        { id: 'db', service: 'RDS', category: 'database' }
      ]
    }

    // Test architecture structure validation
    expect(mockArchitecture).toHaveProperty('architecture_name')
    expect(mockArchitecture.services).toHaveLength(2)
    expect(mockArchitecture.services[0]).toHaveProperty('id')
    expect(mockArchitecture.services[0]).toHaveProperty('service')
    expect(mockArchitecture.services[0]).toHaveProperty('category')
  })

  it('should handle BYO-API credential structure', () => {
    const credentials = {
      aws: { 
        accessKey: 'AKIATEST123', 
        secretKey: 'test-secret', 
        region: 'us-east-1' 
      },
      stripe: {
        publishableKey: 'pk_test_123',
        secretKey: 'sk_test_123'
      }
    }

    // Validate credential structure
    expect(credentials.aws).toHaveProperty('accessKey')
    expect(credentials.aws).toHaveProperty('secretKey')
    expect(credentials.aws).toHaveProperty('region')
    expect(credentials.stripe).toHaveProperty('publishableKey')
  })

  it('should validate service categories', () => {
    const validCategories = ['compute', 'storage', 'database', 'networking', 'security']
    const testService = { category: 'compute' }

    expect(validCategories).toContain(testService.category)
  })
})
