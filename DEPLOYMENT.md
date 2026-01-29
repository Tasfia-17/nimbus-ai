# NimbusAI Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. AWS Amplify
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize and deploy
amplify init
amplify add hosting
amplify publish
```

### 3. Self-Hosted
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local` file:
```bash
# Optional: AWS credentials for BYO-API feature
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Optional: External service credentials
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
SENDGRID_API_KEY=SG...
```

## Performance Optimization

### Production Build
```bash
# Optimize bundle size
npm run build
npm run analyze

# Enable compression
npm install compression
```

### CDN Configuration
- Enable CloudFront for static assets
- Configure proper cache headers
- Use WebP images where supported

## Monitoring & Logging

### Error Tracking
```bash
# Add Sentry for error monitoring
npm install @sentry/nextjs
```

### Performance Monitoring
- Enable Core Web Vitals tracking
- Set up CloudWatch dashboards
- Monitor API response times

## Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Configure CSP headers
- [ ] Validate all user inputs
- [ ] Secure API endpoints
- [ ] Regular dependency updates
- [ ] Environment variable protection

## Scaling Considerations

### Horizontal Scaling
- Use load balancers (ALB/NLB)
- Implement session stickiness
- Database connection pooling

### Vertical Scaling
- Monitor CPU/memory usage
- Optimize React components
- Implement code splitting

## Troubleshooting

### Common Issues
1. **Build failures**: Check Node.js version (18+)
2. **API timeouts**: Increase timeout limits
3. **Memory issues**: Optimize bundle size
4. **CORS errors**: Configure proper headers

### Debug Commands
```bash
# Check build output
npm run build 2>&1 | tee build.log

# Analyze bundle
npm run analyze

# Test production build locally
npm run start
```
