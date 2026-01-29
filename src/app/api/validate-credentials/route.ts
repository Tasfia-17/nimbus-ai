import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { service, credentials } = await request.json()

    if (!service || !credentials) {
      return Response.json({ valid: false, error: 'Missing service or credentials' }, { status: 400 })
    }

    let valid = false

    switch (service) {
      case 'aws':
        valid = validateAWS(credentials)
        break
      case 'stripe':
        valid = validateStripe(credentials)
        break
      case 'twilio':
        valid = validateTwilio(credentials)
        break
      case 'sendgrid':
        valid = validateSendGrid(credentials)
        break
      default:
        return Response.json({ valid: false, error: 'Unknown service' }, { status: 400 })
    }

    return Response.json({ valid })
  } catch (error) {
    return Response.json({ valid: false, error: 'Validation failed' }, { status: 500 })
  }
}

function validateAWS(credentials: any): boolean {
  const { accessKeyId, secretAccessKey, region } = credentials
  return !!(
    accessKeyId?.startsWith('AKIA') &&
    secretAccessKey?.length >= 40 &&
    region?.match(/^[a-z]{2}-[a-z]+-\d$/)
  )
}

function validateStripe(credentials: any): boolean {
  const { publishableKey, secretKey } = credentials
  return !!(
    publishableKey?.startsWith('pk_') &&
    secretKey?.startsWith('sk_')
  )
}

function validateTwilio(credentials: any): boolean {
  const { accountSid, authToken } = credentials
  return !!(
    accountSid?.startsWith('AC') &&
    accountSid?.length === 34 &&
    authToken?.length === 32
  )
}

function validateSendGrid(credentials: any): boolean {
  const { apiKey } = credentials
  return !!(apiKey?.startsWith('SG.') && apiKey?.length > 20)
}
