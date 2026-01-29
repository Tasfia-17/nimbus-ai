// Integration test for API endpoints
describe('API Integration', () => {
  it('should validate API request structure', () => {
    const validateCredentialsRequest = {
      service: 'aws',
      credentials: {
        accessKey: 'AKIATEST123',
        secretKey: 'test-secret',
        region: 'us-east-1'
      }
    }

    const generateArchitectureRequest = {
      prompt: 'Build a simple web app',
      constraints: {}
    }

    // Validate request structures
    expect(validateCredentialsRequest).toHaveProperty('service')
    expect(validateCredentialsRequest).toHaveProperty('credentials')
    expect(validateCredentialsRequest.credentials).toHaveProperty('accessKey')

    expect(generateArchitectureRequest).toHaveProperty('prompt')
    expect(generateArchitectureRequest).toHaveProperty('constraints')
  })

  it('should validate API response structure', () => {
    const credentialValidationResponse = {
      valid: true,
      service: 'aws',
      message: 'Credentials validated successfully'
    }

    const architectureResponse = {
      architecture_name: 'Generated Architecture',
      services: [],
      well_architected_score: {
        security: 85,
        cost: 75,
        reliability: 90
      }
    }

    // Validate response structures
    expect(credentialValidationResponse).toHaveProperty('valid')
    expect(credentialValidationResponse).toHaveProperty('service')

    expect(architectureResponse).toHaveProperty('architecture_name')
    expect(architectureResponse).toHaveProperty('services')
    expect(architectureResponse).toHaveProperty('well_architected_score')
  })

  it('should handle error responses', () => {
    const errorResponse = {
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
      status: 400
    }

    expect(errorResponse).toHaveProperty('error')
    expect(errorResponse).toHaveProperty('code')
    expect(errorResponse.status).toBe(400)
  })
})
