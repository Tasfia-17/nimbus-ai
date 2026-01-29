# NimbusAI Agent Architecture

This document provides technical deep-dives into the 7 specialized Kiro agents that power NimbusAI's multi-agent workflow system.

## Overview

NimbusAI employs a sophisticated multi-agent architecture where each agent specializes in a specific domain of cloud infrastructure design. This approach ensures expert-level output at each stage while maintaining deterministic, auditable workflows.

## Agent Workflow Pipeline

```
User Prompt → Architecture Planner → Diagram Generator → Terraform Engineer
                     ↓                      ↓                    ↓
              Cost Analyst ← Security Auditor ← Architecture Explainer
                     ↓
              UI Layout Designer
```

---

## 1. Architecture Planner Agent

**Role**: Primary intelligence and AWS Solutions Architect

### Technical Specifications
- **Input**: Natural language requirements and constraints
- **Output**: Structured JSON with AWS service specifications
- **Processing Time**: 3-8 seconds average
- **Well-Architected Scoring**: Real-time assessment across 6 pillars

### Core Capabilities
- **Service Selection Logic**: Prioritizes serverless and managed services
- **BYO-API Integration**: Detects existing resources and integrates them
- **Constraint Handling**: Processes "what-if" scenarios and traffic projections
- **Compliance Validation**: Ensures AWS Well-Architected Framework adherence

### Output Schema
```json
{
  "architecture_name": "string",
  "version": "string",
  "well_architected_score": {
    "security": 0-100,
    "cost": 0-100,
    "reliability": 0-100,
    "performance": 0-100,
    "operational_excellence": 0-100,
    "sustainability": 0-100
  },
  "services": [
    {
      "id": "unique_id",
      "service": "AWS service name",
      "category": "compute|storage|database|networking|integration|security",
      "purpose": "functional description",
      "scaling_strategy": "auto|manual|serverless",
      "connections": ["service_id"]
    }
  ]
}
```

### Decision Matrix
- **Compute**: Lambda (event-driven) > ECS (containers) > EC2 (legacy)
- **Storage**: S3 (object) > EFS (shared) > EBS (block)
- **Database**: DynamoDB (NoSQL) > RDS (relational) > ElastiCache (cache)
- **Security**: IAM roles > Security groups > NACLs

---

## 2. Diagram Generator Agent

**Role**: Visual layout optimization and spatial reasoning

### Technical Specifications
- **Input**: Architecture JSON from Architecture Planner
- **Output**: React Flow node/edge coordinates and styling
- **Layout Algorithm**: Hierarchical with collision detection
- **Rendering**: Real-time canvas updates

### Core Capabilities
- **Spatial Optimization**: Minimizes edge crossings and node overlap
- **Hierarchical Layouts**: Groups services by tier (web, app, data)
- **Connection Routing**: Intelligent edge routing with bezier curves
- **Responsive Design**: Adapts to canvas size and zoom levels

### Layout Rules
```typescript
interface LayoutRules {
  nodeSpacing: { x: 200, y: 150 }
  tierSeparation: 300
  connectionTypes: {
    'api-call': 'bezier',
    'data-flow': 'straight',
    'vpc-connection': 'step'
  }
}
```

### Visual Hierarchy
1. **Internet Gateway** (top)
2. **Load Balancers** (web tier)
3. **Compute Services** (app tier)
4. **Databases** (data tier)
5. **Storage & Cache** (supporting services)

---

## 3. Terraform Engineer Agent

**Role**: Infrastructure as Code generation and best practices

### Technical Specifications
- **Input**: Architecture specification and existing resources
- **Output**: Production-ready Terraform modules
- **Standards**: HCL 2.0 with provider version pinning
- **Validation**: terraform validate and terraform plan simulation

### Core Capabilities
- **Module Generation**: Creates reusable, parameterized modules
- **State Management**: Implements S3 backend with DynamoDB locking
- **Resource Dependencies**: Proper dependency graphs and ordering
- **Security Hardening**: Least privilege IAM and encryption by default

### Module Structure
```
terraform/
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   ├── compute/
│   └── database/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── main.tf
```

### Best Practices Enforced
- Provider version constraints (`~> 5.0`)
- Consistent resource naming (`${var.project}-${var.environment}-${var.service}`)
- Comprehensive tagging strategy
- Remote state configuration
- Input validation and type constraints

---

## 4. Cost Analyst Agent

**Role**: Real-time pricing analysis and optimization

### Technical Specifications
- **Input**: Architecture services and usage patterns
- **Output**: Detailed cost breakdown with optimization recommendations
- **Pricing Data**: AWS Pricing API integration (simulated)
- **Accuracy**: ±15% of actual AWS costs

### Core Capabilities
- **Multi-Dimensional Costing**: Compute, storage, network, operations
- **Scenario Modeling**: Traffic spikes, scaling events, regional differences
- **Optimization Engine**: Reserved instances, spot instances, rightsizing
- **Trend Analysis**: Cost projection over 12-month periods

### Cost Calculation Engine
```typescript
interface CostModel {
  compute: {
    onDemand: number
    reserved: number
    spot: number
  }
  storage: {
    standard: number
    infrequentAccess: number
    glacier: number
  }
  network: {
    dataTransfer: number
    cloudFront: number
  }
}
```

### Optimization Strategies
1. **Reserved Instance Analysis**: 1-year vs 3-year commitments
2. **Storage Class Optimization**: Intelligent tiering recommendations
3. **Compute Rightsizing**: CPU/memory utilization analysis
4. **Network Optimization**: CDN and data transfer cost reduction

---

## 5. Security Auditor Agent

**Role**: Vulnerability assessment and compliance validation

### Technical Specifications
- **Input**: Complete architecture specification
- **Output**: Security score, vulnerabilities, and remediation steps
- **Frameworks**: NIST, CIS, AWS Security Best Practices
- **Compliance**: GDPR, HIPAA, SOX assessment

### Core Capabilities
- **Threat Modeling**: STRIDE methodology implementation
- **Vulnerability Scanning**: Configuration and architectural weaknesses
- **Compliance Mapping**: Regulatory requirement validation
- **Remediation Engine**: Automated fix generation

### Security Assessment Matrix
```typescript
interface SecurityAssessment {
  categories: {
    identity: SecurityScore      // IAM, MFA, access controls
    network: SecurityScore       // VPC, security groups, NACLs
    data: SecurityScore         // Encryption, key management
    monitoring: SecurityScore   // CloudTrail, GuardDuty, Config
    compliance: SecurityScore   // Industry standards
  }
  vulnerabilities: Vulnerability[]
  recommendations: Remediation[]
}
```

### Severity Levels
- **Critical**: Immediate data exposure risk (Score: 0-25)
- **High**: Significant security gap (Score: 26-50)
- **Medium**: Security improvement needed (Score: 51-75)
- **Low**: Best practice recommendation (Score: 76-100)

---

## 6. Architecture Explainer Agent

**Role**: Documentation generation and knowledge transfer

### Technical Specifications
- **Input**: Complete architecture and design decisions
- **Output**: Comprehensive documentation in multiple formats
- **Formats**: Markdown, PDF, Confluence, README
- **Audience**: Technical and non-technical stakeholders

### Core Capabilities
- **Decision Documentation**: Rationale for architectural choices
- **Runbook Generation**: Operational procedures and troubleshooting
- **Onboarding Guides**: New team member documentation
- **Change Impact Analysis**: Modification risk assessment

### Documentation Structure
```markdown
# Architecture Documentation

## Executive Summary
## Architecture Overview
## Service Breakdown
## Security Considerations
## Cost Analysis
## Operational Procedures
## Troubleshooting Guide
## Change Management
```

### Content Generation Rules
- **Technical Depth**: Adjusts complexity based on audience
- **Visual Integration**: Includes diagrams and flowcharts
- **Code Examples**: Provides implementation snippets
- **Best Practices**: Links to AWS documentation and guidelines

---

## 7. UI Layout Designer Agent

**Role**: Interface optimization and user experience

### Technical Specifications
- **Input**: User interaction patterns and component requirements
- **Output**: React component specifications and styling
- **Design System**: Glassmorphism with dark mode optimization
- **Responsiveness**: Mobile-first responsive design

### Core Capabilities
- **Component Generation**: Reusable UI component creation
- **Layout Optimization**: Grid and flexbox layout systems
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Bundle size and rendering optimization

### Design Principles
```typescript
interface DesignSystem {
  colors: {
    primary: '#050510'
    accent: '#E8C77C'
    glass: 'rgba(255,255,255,0.08)'
  }
  effects: {
    backdropBlur: '16px'
    borderRadius: '12px'
    transition: '0.3s ease'
  }
  spacing: {
    unit: 8
    scale: [0, 8, 16, 24, 32, 48, 64]
  }
}
```

### Component Architecture
- **Atomic Design**: Atoms → Molecules → Organisms → Templates
- **State Management**: React Context with TypeScript
- **Animation**: Framer Motion for micro-interactions
- **Testing**: Jest + React Testing Library

---

## Inter-Agent Communication

### Message Passing Protocol
```typescript
interface AgentMessage {
  from: AgentType
  to: AgentType
  type: 'request' | 'response' | 'notification'
  payload: any
  timestamp: number
  correlationId: string
}
```

### Workflow Orchestration
1. **Sequential Processing**: Architecture → Diagram → Terraform
2. **Parallel Analysis**: Cost + Security + Documentation
3. **Feedback Loops**: UI updates trigger re-analysis
4. **Error Handling**: Graceful degradation and retry logic

### Performance Optimization
- **Caching**: Agent responses cached for 5 minutes
- **Streaming**: Real-time progress updates
- **Batching**: Multiple requests combined when possible
- **Timeout Handling**: 60-second maximum per agent

---

## Quality Assurance

### Testing Strategy
- **Unit Tests**: Individual agent logic validation
- **Integration Tests**: Multi-agent workflow testing
- **Performance Tests**: Response time and throughput
- **Security Tests**: Input validation and sanitization

### Monitoring & Observability
- **Agent Performance**: Response times and success rates
- **Error Tracking**: Failed requests and retry patterns
- **Usage Analytics**: Most common workflows and patterns
- **Quality Metrics**: Output accuracy and user satisfaction

This multi-agent architecture ensures that NimbusAI delivers expert-level cloud architecture design while maintaining the speed and consistency required for production use.
