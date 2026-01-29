# Contributing to NimbusAI

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/nimbus-ai.git
   cd nimbus-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Provide type definitions for all functions
- Avoid `any` types

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines (WCAG 2.1 AA)

### Styling
- Use Tailwind CSS utility classes
- Follow glassmorphism design principles
- Ensure responsive design

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## Pull Request Process

1. Create feature branch from `main`
2. Make changes with proper commit messages
3. Add tests for new functionality
4. Update documentation as needed
5. Submit pull request with description

## Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Architecture Guidelines

### Agent Development
- Follow the 7-agent architecture pattern
- Implement proper error handling
- Use structured JSON outputs
- Document agent capabilities

### API Design
- RESTful endpoints with proper HTTP methods
- Consistent error response format
- Input validation and sanitization
- Rate limiting for public endpoints

### Performance
- Optimize bundle size (< 250KB gzipped)
- Implement code splitting
- Use React.memo for expensive components
- Minimize re-renders

## Security

- Never commit secrets or API keys
- Validate all user inputs
- Use HTTPS everywhere
- Implement proper CORS policies
- Regular dependency updates

## Documentation

- Update README for new features
- Document API changes
- Include code examples
- Maintain architecture diagrams
