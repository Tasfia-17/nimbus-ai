export enum AWSServiceCategory {
  COMPUTE = 'compute',
  STORAGE = 'storage',
  DATABASE = 'database',
  NETWORKING = 'networking',
  SECURITY = 'security',
  INTEGRATION = 'integration',
  ANALYTICS = 'analytics',
  ML = 'ml'
}

export interface AWSService {
  id: string
  name: string
  category: AWSServiceCategory
  icon: string
  description: string
  color: string
  pricing?: {
    model: string
    basePrice: number
    unit: string
  }
}

export interface APICredential {
  id: string
  name: string
  type: 'aws' | 'stripe' | 'twilio' | 'sendgrid'
  status: 'active' | 'inactive' | 'expired'
  lastUsed?: Date
  masked?: boolean
}
