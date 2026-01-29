# Architecture Decision Records

## ADR-001: Multi-Agent vs Monolithic AI Architecture
**Date**: 2026-01-20  
**Status**: Accepted  
**Decision**: Multi-agent architecture with 7 specialized agents  
**Rationale**: 
- Specialized expertise per domain (architecture, cost, security)
- Parallel processing capabilities
- Better maintainability and testing
- Clearer separation of concerns

## ADR-002: React Flow vs Custom Canvas
**Date**: 2026-01-22  
**Status**: Accepted  
**Decision**: React Flow for infinite canvas  
**Rationale**:
- Mature ecosystem with built-in features
- Better performance for large node graphs
- Extensive customization options
- Active community support

## ADR-003: BYO-API Security Model
**Date**: 2026-01-24  
**Status**: Accepted  
**Decision**: Local credential storage with encryption  
**Rationale**:
- User maintains control of sensitive credentials
- No server-side credential storage
- Supports multiple cloud providers
- Enables real resource validation

## ADR-004: Streaming vs Batch Architecture Generation
**Date**: 2026-01-25  
**Status**: Accepted  
**Decision**: Streaming workflow with real-time updates  
**Rationale**:
- Better user experience with progress feedback
- Enables partial results display
- Supports cancellation and retry
- Reduces perceived latency
