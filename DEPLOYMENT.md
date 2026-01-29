# NimbusAI Deployment Guide

## Production Deployment Options

### 1. Vercel Deployment (Recommended)

#### Prerequisites
- Vercel account
- GitHub repository
- Kiro CLI access token

#### Steps
1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Environment Variables**
   Set in Vercel dashboard:
   ```
   KIRO_API_TOKEN=your_kiro_token
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **Build Configuration**
   Vercel auto-detects Next.js. Ensure `vercel.json`:
   ```json
   {
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "outputDirectory": ".next"
   }
   ```

### 2. AWS Deployment

#### Option A: AWS Amplify
1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect GitHub repository
   - Select main branch

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

3. **Environment Variables**
   ```
   KIRO_API_TOKEN=your_token
   NODE_ENV=production
   ```

#### Option B: ECS with Fargate
1. **Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Deploy to ECS**
   ```bash
   # Build and push to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   docker build -t nimbusai .
   docker tag nimbusai:latest your-account.dkr.ecr.us-east-1.amazonaws.com/nimbusai:latest
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/nimbusai:latest
   ```

### 3. Self-Hosted Deployment

#### Using PM2
1. **Install Dependencies**
   ```bash
   npm install -g pm2
   npm ci
   npm run build
   ```

2. **PM2 Configuration** (`ecosystem.config.js`)
   ```javascript
   module.exports = {
     apps: [{
       name: 'nimbusai',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000,
         KIRO_API_TOKEN: 'your_token'
       }
     }]
   }
   ```

3. **Start Application**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

#### Using Docker Compose
```yaml
version: '3.8'
services:
  nimbusai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - KIRO_API_TOKEN=${KIRO_API_TOKEN}
    restart: unless-stopped
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - nimbusai
```

## Environment Configuration

### Required Environment Variables
```bash
# Kiro CLI Integration
KIRO_API_TOKEN=your_kiro_cli_token

# Next.js Configuration
NODE_ENV=production
NEXTAUTH_SECRET=random_32_char_string
NEXTAUTH_URL=https://your-domain.com

# Optional: External Service Integration
AWS_REGION=us-east-1
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### Security Configuration
1. **HTTPS Setup**
   - Use SSL certificates (Let's Encrypt recommended)
   - Configure security headers
   - Enable HSTS

2. **Rate Limiting**
   ```javascript
   // Add to middleware
   const rateLimit = {
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   }
   ```

## Performance Optimization

### 1. Caching Strategy
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate' }
        ]
      }
    ]
  }
}
```

### 2. CDN Configuration
- Enable CloudFront or Vercel Edge Network
- Cache static assets for 1 year
- Cache API responses for 5 minutes

### 3. Database Optimization
- Use connection pooling for external APIs
- Implement request deduplication
- Add response caching for Kiro CLI calls

## Monitoring & Observability

### 1. Application Monitoring
```javascript
// Add to pages/_app.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### 2. Error Tracking
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})
```

### 3. Health Checks
```javascript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

## Troubleshooting

### Common Issues
1. **Kiro CLI Connection Timeout**
   - Increase timeout in production: `KIRO_TIMEOUT=60000`
   - Check network connectivity to Kiro services

2. **Memory Issues**
   - Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=4096"`
   - Monitor memory usage with PM2 or container metrics

3. **Build Failures**
   - Ensure all environment variables are set
   - Check Node.js version compatibility (18+)
   - Verify TypeScript compilation

### Performance Monitoring
```bash
# Check application performance
npm run build && npm run start
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000"

# Monitor resource usage
docker stats nimbusai
pm2 monit
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (ALB, Nginx)
- Implement session affinity if needed
- Scale based on CPU/memory metrics

### Vertical Scaling
- Monitor resource usage patterns
- Scale container resources based on demand
- Use auto-scaling groups in cloud environments

### Database Scaling
- Implement connection pooling
- Use read replicas for external API caching
- Consider Redis for session storage
