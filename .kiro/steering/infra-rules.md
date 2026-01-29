# NimbusAI Infrastructure Rules

## Terraform Standards
- Use consistent module structure with variables, outputs, and main.tf
- Pin provider versions for reproducibility
- Implement remote state with S3 backend and DynamoDB locking
- Use data sources for existing resources, avoid hardcoded values
- Apply consistent tagging strategy across all resources

## Resource Sizing Guidelines
- **EC2**: Start with t3.micro for dev, t3.medium for prod, scale based on metrics
- **RDS**: db.t3.micro for dev, db.t3.small minimum for prod
- **Lambda**: 128MB default, increase based on execution time patterns
- **EBS**: gp3 volumes with baseline IOPS, provision IOPS only when needed

## Monitoring & Observability
- CloudWatch alarms for all critical metrics (CPU, memory, disk, network)
- Application-level logging with structured JSON format
- Distributed tracing for microservices architectures
- Custom metrics for business KPIs

## Backup & Disaster Recovery
- Automated daily backups with 7-day retention minimum
- Cross-region replication for critical data
- RTO/RPO requirements documented per service
- Regular disaster recovery testing procedures

## Cost Control Measures
- Implement resource lifecycle policies (S3, EBS snapshots)
- Use Spot instances for non-critical workloads
- Schedule start/stop for development environments
- Regular cost reviews and rightsizing recommendations

## Compliance Requirements
- Enable CloudTrail for all API calls
- VPC Flow Logs for network monitoring
- Config rules for compliance validation
- Regular security assessments and penetration testing
