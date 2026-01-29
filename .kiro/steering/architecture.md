# NimbusAI Architecture Rules

## AWS Well-Architected Framework Compliance
- **Operational Excellence**: Automate deployment pipelines, implement monitoring and logging
- **Security**: Apply least privilege, encrypt data at rest and in transit, use IAM roles
- **Reliability**: Design for failure, implement multi-AZ deployments, use auto-scaling
- **Performance Efficiency**: Right-size resources, use caching, implement CDN
- **Cost Optimization**: Use Reserved Instances, implement lifecycle policies, monitor usage
- **Sustainability**: Optimize resource utilization, use managed services, implement efficient architectures

## Service Selection Patterns
- **Compute**: Prefer serverless (Lambda) for event-driven workloads, ECS/EKS for containers, EC2 for legacy
- **Storage**: S3 for object storage, EFS for shared file systems, EBS for block storage
- **Database**: RDS for relational, DynamoDB for NoSQL, ElastiCache for caching
- **Networking**: VPC with private subnets, ALB/NLB for load balancing, CloudFront for CDN

## Naming Conventions
- Resources: `{project}-{environment}-{service}-{identifier}`
- Tags: Environment, Project, Owner, CostCenter, Backup
- Security Groups: Descriptive names with purpose (e.g., `web-tier-sg`, `db-tier-sg`)

## Security Defaults
- All resources in private subnets unless public access required
- Security groups with minimal required ports
- IAM roles with least privilege principle
- Encryption enabled by default for all storage services
- VPC Flow Logs enabled for network monitoring

## High Availability Patterns
- Multi-AZ deployments for production workloads
- Auto Scaling Groups with health checks
- Cross-region backups for critical data
- Route 53 health checks for DNS failover
