export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validatePrompt(prompt: string): ValidationResult {
  if (!prompt || typeof prompt !== 'string') {
    return { isValid: false, error: 'Prompt is required and must be a string' }
  }

  if (prompt.trim().length === 0) {
    return { isValid: false, error: 'Prompt cannot be empty' }
  }

  if (prompt.length > 5000) {
    return { isValid: false, error: 'Prompt exceeds maximum length of 5000 characters' }
  }

  // Check for potential command injection patterns
  const dangerousPatterns = [
    /[;&|`$(){}[\]]/,
    /\b(rm|del|format|shutdown|reboot)\b/i,
    /\b(sudo|su|chmod|chown)\b/i,
    /[<>]/
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(prompt)) {
      return { isValid: false, error: 'Prompt contains potentially unsafe characters or commands' }
    }
  }

  return { isValid: true }
}

export function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .slice(0, 5000) // Enforce max length
}

// Simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(clientId: string, maxRequests = 10, windowMs = 60000): ValidationResult {
  const now = Date.now()
  const clientData = requestCounts.get(clientId)

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + windowMs })
    return { isValid: true }
  }

  if (clientData.count >= maxRequests) {
    return { 
      isValid: false, 
      error: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.` 
    }
  }

  clientData.count++
  return { isValid: true }
}

export function getClientId(request: Request): string {
  // In a real application, you might use IP address, user ID, or session ID
  // For now, use a simple approach based on headers
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}
