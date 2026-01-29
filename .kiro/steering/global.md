# NimbusAI Global Configuration

## Project Standards
- **Code Quality**: ESLint + Prettier for consistent formatting
- **Type Safety**: Strict TypeScript configuration with no implicit any
- **Testing**: Jest + React Testing Library for comprehensive coverage
- **Documentation**: JSDoc comments for all public APIs

## Environment Management
- **Development**: Local development with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Optimized builds with monitoring

## Error Handling
- Graceful degradation for API failures
- User-friendly error messages
- Comprehensive logging for debugging
- Retry mechanisms for transient failures

## Performance Standards
- **Bundle Size**: Keep JavaScript bundles under 250KB gzipped
- **Loading**: First Contentful Paint under 1.5s
- **Interactivity**: Time to Interactive under 3s
- **Accessibility**: WCAG 2.1 AA compliance

## Security Practices
- Input validation and sanitization
- HTTPS everywhere with proper headers
- Content Security Policy implementation
- Regular dependency updates and vulnerability scanning
