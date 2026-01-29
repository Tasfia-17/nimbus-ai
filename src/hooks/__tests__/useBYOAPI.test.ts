import { renderHook, act } from '@testing-library/react'
import { useBYOAPI } from '../useBYOAPI'

// Mock fetch
global.fetch = jest.fn()

describe('useBYOAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useBYOAPI())

    expect(result.current.credentials).toEqual({})
    expect(result.current.isConfigured).toBe(false)
    expect(result.current.validationStatus).toEqual({})
  })

  it('should update credentials correctly', async () => {
    const { result } = renderHook(() => useBYOAPI())

    await act(async () => {
      await result.current.updateCredentials('aws', {
        accessKeyId: 'AKIA123',
        secretAccessKey: 'secret123',
        region: 'us-east-1'
      })
    })

    expect(result.current.credentials.aws).toEqual({
      accessKeyId: 'AKIA123',
      secretAccessKey: 'secret123',
      region: 'us-east-1'
    })
    expect(result.current.validationStatus.aws).toBe('pending')
  })

  it('should validate credentials successfully', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ valid: true })
    })

    const { result } = renderHook(() => useBYOAPI())

    act(() => {
      result.current.updateCredentials('aws', {
        accessKeyId: 'AKIA123',
        secretAccessKey: 'secret123',
        region: 'us-east-1'
      })
    })

    await act(async () => {
      await result.current.validateCredentials('aws')
    })

    expect(result.current.validationStatus.aws).toBe('valid')
    expect(result.current.isConfigured).toBe(true)
  })

  it('should handle validation failure', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ valid: false })
    })

    const { result } = renderHook(() => useBYOAPI())

    act(() => {
      result.current.updateCredentials('stripe', {
        publishableKey: 'pk_test_123',
        secretKey: 'sk_test_123'
      })
    })

    await act(async () => {
      await result.current.validateCredentials('stripe')
    })

    expect(result.current.validationStatus.stripe).toBe('invalid')
    expect(result.current.isConfigured).toBe(false)
  })

  it('should handle network errors during validation', async () => {
    ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useBYOAPI())

    act(() => {
      result.current.updateCredentials('twilio', {
        accountSid: 'AC123',
        authToken: 'token123'
      })
    })

    await act(async () => {
      await result.current.validateCredentials('twilio')
    })

    expect(result.current.validationStatus.twilio).toBe('invalid')
  })

  it('should clear credentials correctly', () => {
    const { result } = renderHook(() => useBYOAPI())

    act(() => {
      result.current.updateCredentials('sendgrid', {
        apiKey: 'SG.test123'
      })
    })

    act(() => {
      result.current.clearCredentials('sendgrid')
    })

    expect(result.current.credentials.sendgrid).toBeUndefined()
    expect(result.current.validationStatus.sendgrid).toBeUndefined()
  })

  it('should update isConfigured when multiple services are validated', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ valid: true })
    })

    const { result } = renderHook(() => useBYOAPI())

    // Add AWS credentials
    act(() => {
      result.current.updateCredentials('aws', {
        accessKeyId: 'AKIA123',
        secretAccessKey: 'secret123',
        region: 'us-east-1'
      })
    })

    await act(async () => {
      await result.current.validateCredentials('aws')
    })

    // Add Stripe credentials
    act(() => {
      result.current.updateCredentials('stripe', {
        publishableKey: 'pk_test_123',
        secretKey: 'sk_test_123'
      })
    })

    await act(async () => {
      await result.current.validateCredentials('stripe')
    })

    expect(result.current.isConfigured).toBe(true)
    expect(result.current.validationStatus.aws).toBe('valid')
    expect(result.current.validationStatus.stripe).toBe('valid')
  })
})
