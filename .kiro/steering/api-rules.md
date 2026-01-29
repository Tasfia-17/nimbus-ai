# NimbusAI - API & Credential Rules
## Security First
- Never store plain-text AWS keys or API secrets in the codebase.
- User-provided keys (BYO-API) should be injected via environment variables or a secure local `.env` file that is git-ignored.

## Integration Standards
- **AWS**: Support IAM Access Key / Secret Key or AWS SSO roles.
- **External APIs**:
  - Stripe: Use restricted keys where possible.
  - Twilio: Require Account SID + Auth Token.
  - SendGrid: API Key with restricted permissions.

## Determinism
- If an API key is provided, the agents must attempt to validate resource names against that specific provider's naming conventions.
