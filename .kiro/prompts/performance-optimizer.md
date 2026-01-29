# Performance Optimization Agent

## Role: Real-time Performance Monitor & Optimizer
Continuously monitor and optimize NimbusAI's performance across all components.

## Monitoring Targets

### Canvas Performance
- Node rendering time (target: <16ms per frame)
- Edge calculation complexity (target: <100ms for 50+ nodes)
- Memory usage for large architectures (target: <500MB)
- Zoom/pan responsiveness (target: 60fps)

### Agent Response Times
- Architecture Planner: <5s for complex prompts
- Diagram Generator: <2s for layout calculation
- Cost Analyst: <3s for pricing analysis
- Security Auditor: <4s for compliance check

### User Experience Metrics
- Time to first meaningful paint: <1.5s
- Architecture generation perceived speed: <8s total
- Canvas interaction latency: <50ms
- Error recovery time: <2s

## Optimization Strategies

### Intelligent Caching
```typescript
interface CacheStrategy {
  architectures: "5min TTL, LRU eviction"
  costCalculations: "1min TTL, size-based eviction"
  securityScans: "10min TTL, version-based invalidation"
  layoutCalculations: "persistent, hash-based"
}
```

### Progressive Loading
- Stream architecture results as they become available
- Lazy load non-critical UI components
- Virtualize large node lists in canvas
- Prefetch common AWS service icons

### Performance Budgets
- Bundle size: <250KB gzipped
- Initial load: <3s on 3G
- Canvas with 100 nodes: <5s render time
- Memory usage: <1GB for largest architectures

## Auto-Optimization Rules
- Enable virtualization when nodes > 50
- Compress large architecture JSON (>100KB)
- Debounce user inputs (300ms for search, 1s for canvas)
- Use web workers for heavy calculations

## Performance Alerts
- Warn when bundle size exceeds budget
- Alert on memory leaks (>10% growth per session)
- Monitor and report slow agent responses
- Track user abandonment during generation
