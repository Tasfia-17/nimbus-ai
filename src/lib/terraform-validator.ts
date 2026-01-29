// Mock implementation for build compatibility
const executeKiroAgent = async (agent: string, prompt: string): Promise<any> => {
  return { success: true, data: prompt }
}

export interface TerraformValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  securityIssues: string[]
  costOptimizations: string[]
  bestPracticeViolations: string[]
}

export class TerraformValidator {
  async validateConfiguration(terraformCode: string): Promise<TerraformValidationResult> {
    const result: TerraformValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      securityIssues: [],
      costOptimizations: [],
      bestPracticeViolations: []
    }

    // Syntax validation
    const syntaxErrors = this.validateSyntax(terraformCode)
    result.errors.push(...syntaxErrors)

    // Security validation
    const securityIssues = await this.validateSecurity(terraformCode)
    result.securityIssues.push(...securityIssues)

    // Cost optimization checks
    const costIssues = this.validateCostOptimization(terraformCode)
    result.costOptimizations.push(...costIssues)

    // Best practices validation
    const practiceIssues = this.validateBestPractices(terraformCode)
    result.bestPracticeViolations.push(...practiceIssues)

    result.isValid = result.errors.length === 0

    return result
  }

  private validateSyntax(code: string): string[] {
    const errors: string[] = []
    
    // Check for basic syntax issues
    if (!code.includes('terraform {')) {
      errors.push('Missing terraform configuration block')
    }
    
    if (!code.includes('provider ')) {
      errors.push('No provider configuration found')
    }

    // Check for unmatched braces
    const openBraces = (code.match(/{/g) || []).length
    const closeBraces = (code.match(/}/g) || []).length
    if (openBraces !== closeBraces) {
      errors.push('Unmatched braces in configuration')
    }

    return errors
  }

  private async validateSecurity(code: string): Promise<string[]> {
    const issues: string[] = []

    // Check for hardcoded secrets
    if (code.match(/password\s*=\s*"[^"]+"/i)) {
      issues.push('Hardcoded password detected - use variables or secrets manager')
    }

    // Check for public access
    if (code.includes('0.0.0.0/0') && code.includes('ingress')) {
      issues.push('Security group allows unrestricted inbound access')
    }

    // Check for unencrypted storage
    if (code.includes('aws_s3_bucket') && !code.includes('server_side_encryption')) {
      issues.push('S3 bucket missing encryption configuration')
    }

    return issues
  }

  private validateCostOptimization(code: string): string[] {
    const optimizations: string[] = []

    // Check for instance types
    if (code.includes('instance_type = "m5.large"')) {
      optimizations.push('Consider using t3.medium for development workloads')
    }

    // Check for storage optimization
    if (code.includes('volume_type = "gp2"')) {
      optimizations.push('Consider upgrading to gp3 for better price/performance')
    }

    // Check for Reserved Instance opportunities
    if (code.includes('aws_instance') && !code.includes('# Reserved Instance')) {
      optimizations.push('Consider Reserved Instances for predictable workloads')
    }

    return optimizations
  }

  private validateBestPractices(code: string): string[] {
    const violations: string[] = []

    // Check for resource naming
    if (!code.match(/resource\s+"[^"]+"\s+"[a-z0-9_-]+"/)) {
      violations.push('Use consistent naming convention for resources')
    }

    // Check for tags
    if (code.includes('aws_instance') && !code.includes('tags = {')) {
      violations.push('Missing resource tags for cost allocation and management')
    }

    // Check for version constraints
    if (!code.includes('required_version')) {
      violations.push('Missing Terraform version constraint')
    }

    return violations
  }

  async generateFixSuggestions(validationResult: TerraformValidationResult): Promise<string> {
    const fixes: string[] = []

    // Generate fixes using Kiro agent
    if (validationResult.securityIssues.length > 0) {
      const securityFixes = await executeKiroAgent('security-auditor', 
        `Generate Terraform fixes for: ${validationResult.securityIssues.join(', ')}`)
      fixes.push(securityFixes)
    }

    if (validationResult.costOptimizations.length > 0) {
      const costFixes = await executeKiroAgent('cost-analyst',
        `Generate cost optimization fixes for: ${validationResult.costOptimizations.join(', ')}`)
      fixes.push(costFixes)
    }

    return fixes.join('\n\n')
  }
}
