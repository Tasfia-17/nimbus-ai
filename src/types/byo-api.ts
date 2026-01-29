export interface APICredentials {
  aws?: {
    accessKeyId: string
    secretAccessKey: string
    region: string
  }
  stripe?: {
    publishableKey: string
    secretKey: string
  }
  twilio?: {
    accountSid: string
    authToken: string
  }
  sendgrid?: {
    apiKey: string
  }
}

export interface BYOAPIState {
  credentials: APICredentials
  isConfigured: boolean
  validationStatus: Record<string, 'valid' | 'invalid' | 'pending'>
}
