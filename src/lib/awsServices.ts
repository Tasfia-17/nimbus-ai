import { AWSService, AWSServiceCategory } from '@/types/aws'

export const awsServices: AWSService[] = [
  // Compute
  {
    id: 'ec2',
    name: 'EC2',
    category: AWSServiceCategory.COMPUTE,
    icon: 'Server',
    description: 'Virtual servers in the cloud',
    color: '#FF9900',
    pricing: { model: 'hourly', basePrice: 0.0116, unit: 'hour' }
  },
  {
    id: 'lambda',
    name: 'Lambda',
    category: AWSServiceCategory.COMPUTE,
    icon: 'Zap',
    description: 'Serverless compute service',
    color: '#FF9900',
    pricing: { model: 'request', basePrice: 0.0000002, unit: 'request' }
  },
  {
    id: 'ecs',
    name: 'ECS',
    category: AWSServiceCategory.COMPUTE,
    icon: 'Container',
    description: 'Container orchestration service',
    color: '#FF9900'
  },
  
  // Storage
  {
    id: 's3',
    name: 'S3',
    category: AWSServiceCategory.STORAGE,
    icon: 'Database',
    description: 'Object storage service',
    color: '#569A31'
  },
  {
    id: 'ebs',
    name: 'EBS',
    category: AWSServiceCategory.STORAGE,
    icon: 'HardDrive',
    description: 'Block storage for EC2',
    color: '#569A31'
  },
  
  // Database
  {
    id: 'rds',
    name: 'RDS',
    category: AWSServiceCategory.DATABASE,
    icon: 'Database',
    description: 'Managed relational database',
    color: '#3F48CC'
  },
  {
    id: 'dynamodb',
    name: 'DynamoDB',
    category: AWSServiceCategory.DATABASE,
    icon: 'Table',
    description: 'NoSQL database service',
    color: '#3F48CC'
  },
  
  // Networking
  {
    id: 'vpc',
    name: 'VPC',
    category: AWSServiceCategory.NETWORKING,
    icon: 'Network',
    description: 'Virtual private cloud',
    color: '#9D5AAE'
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    category: AWSServiceCategory.NETWORKING,
    icon: 'Webhook',
    description: 'API management service',
    color: '#9D5AAE'
  },
  {
    id: 'alb',
    name: 'ALB',
    category: AWSServiceCategory.NETWORKING,
    icon: 'GitBranch',
    description: 'Application load balancer',
    color: '#9D5AAE'
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    category: AWSServiceCategory.NETWORKING,
    icon: 'Globe',
    description: 'Content delivery network',
    color: '#9D5AAE'
  },
  
  // Security
  {
    id: 'iam',
    name: 'IAM',
    category: AWSServiceCategory.SECURITY,
    icon: 'Shield',
    description: 'Identity and access management',
    color: '#DD344C'
  },
  {
    id: 'waf',
    name: 'WAF',
    category: AWSServiceCategory.SECURITY,
    icon: 'ShieldCheck',
    description: 'Web application firewall',
    color: '#DD344C'
  }
]

export const getServicesByCategory = (category: AWSServiceCategory): AWSService[] => {
  return awsServices.filter(service => service.category === category)
}

export const getServiceById = (id: string): AWSService | undefined => {
  return awsServices.find(service => service.id === id)
}

export const getServiceIcon = (serviceId: string): string => {
  const service = getServiceById(serviceId)
  return service?.icon || 'Server'
}
