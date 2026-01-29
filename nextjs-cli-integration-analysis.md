# Next.js Server-Side CLI Integration Patterns

## Overview
This analysis covers secure CLI execution patterns for Next.js applications, specifically for NimbusAI's infrastructure automation needs.

## 1. Safe CLI Execution Patterns

### Basic Secure Execution
```typescript
// src/lib/cli-executor.ts
import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class CLIExecutor {
  private allowedCommands = ['kiro-cli', 'terraform', 'aws'];
  
  validateCommand(command: string): boolean {
    return this.allowedCommands.some(cmd => command.startsWith(cmd));
  }
  
  async executeCommand(command: string, args: string[] = []): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
  }> {
    if (!this.validateCommand(command)) {
      throw new Error('Command not allowed');
    }
    
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'production' },
        timeout: 30000
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout?.on('data', (data) => stdout += data.toString());
      child.stderr?.on('data', (data) => stderr += data.toString());
      
      child.on('close', (code) => {
        resolve({ stdout, stderr, exitCode: code || 0 });
      });
      
      child.on('error', reject);
    });
  }
}
```

### Streaming Response Handler
```typescript
// src/lib/streaming-executor.ts
export class StreamingCLIExecutor {
  async executeWithStream(
    command: string, 
    args: string[],
    onData: (data: string) => void
  ): Promise<void> {
    const child = spawn(command, args, { stdio: 'pipe' });
    
    child.stdout?.on('data', (chunk) => {
      onData(chunk.toString());
    });
    
    child.stderr?.on('data', (chunk) => {
      onData(`ERROR: ${chunk.toString()}`);
    });
    
    return new Promise((resolve, reject) => {
      child.on('close', resolve);
      child.on('error', reject);
    });
  }
}
```

## 2. API Route Implementation

### Basic CLI API Route
```typescript
// src/app/api/cli/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CLIExecutor } from '@/lib/cli-executor';

const executor = new CLIExecutor();

export async function POST(request: NextRequest) {
  try {
    const { command, args } = await request.json();
    
    const result = await executor.executeCommand(command, args);
    
    return NextResponse.json({
      success: true,
      output: result.stdout,
      error: result.stderr,
      exitCode: result.exitCode
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Streaming CLI API Route
```typescript
// src/app/api/cli/stream/route.ts
import { NextRequest } from 'next/server';
import { StreamingCLIExecutor } from '@/lib/streaming-executor';

const executor = new StreamingCLIExecutor();

export async function POST(request: NextRequest) {
  const { command, args } = await request.json();
  
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      executor.executeWithStream(command, args, (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ data })}\n\n`));
      }).then(() => {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }).catch((error) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
        controller.close();
      });
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

## 3. NimbusAI-Specific Implementation

### Kiro CLI Integration
```typescript
// src/app/api/kiro/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CLIExecutor } from '@/lib/cli-executor';

export async function POST(request: NextRequest) {
  const { action, prompt } = await request.json();
  const executor = new CLIExecutor();
  
  try {
    let result;
    
    switch (action) {
      case 'generate-infrastructure':
        result = await executor.executeCommand('kiro-cli', [
          'generate',
          '--prompt', prompt,
          '--output', 'json'
        ]);
        break;
        
      case 'validate-terraform':
        result = await executor.executeCommand('terraform', ['validate']);
        break;
        
      default:
        throw new Error('Invalid action');
    }
    
    return NextResponse.json({
      success: true,
      data: JSON.parse(result.stdout)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Architecture Generation API
```typescript
// src/app/api/architecture/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { description, requirements } = await request.json();
  
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Step 1: Architecture Planning
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          step: 'planning',
          message: 'Analyzing requirements...'
        })}\n\n`));
        
        // Step 2: Generate Terraform
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          step: 'terraform',
          message: 'Generating infrastructure code...'
        })}\n\n`));
        
        // Step 3: Security Audit
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          step: 'security',
          message: 'Running security audit...'
        })}\n\n`));
        
        // Step 4: Cost Analysis
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          step: 'cost',
          message: 'Calculating cost estimates...'
        })}\n\n`));
        
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          error: error.message
        })}\n\n`));
        controller.close();
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  });
}
```

## 4. Security Considerations

### Input Validation
```typescript
// src/lib/validators.ts
import { z } from 'zod';

export const CLICommandSchema = z.object({
  command: z.enum(['kiro-cli', 'terraform', 'aws']),
  args: z.array(z.string()).max(10),
  timeout: z.number().max(300000).optional()
});

export const ArchitectureRequestSchema = z.object({
  description: z.string().min(10).max(1000),
  requirements: z.array(z.string()).max(20),
  awsRegion: z.string().optional()
});
```

### Rate Limiting
```typescript
// src/lib/rate-limiter.ts
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, limit = 10): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  
  const current = rateLimiter.get(ip);
  
  if (!current || now > current.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
}
```

### Environment Isolation
```typescript
// src/lib/sandbox.ts
export class SandboxExecutor {
  private readonly workDir: string;
  
  constructor() {
    this.workDir = `/tmp/nimbus-${Date.now()}`;
  }
  
  async executeInSandbox(command: string, args: string[]) {
    const child = spawn(command, args, {
      cwd: this.workDir,
      env: {
        PATH: '/usr/local/bin:/usr/bin:/bin',
        HOME: this.workDir
      },
      stdio: 'pipe'
    });
    
    // Implementation details...
  }
}
```

## 5. Error Handling Patterns

### Comprehensive Error Handler
```typescript
// src/lib/error-handler.ts
export class CLIError extends Error {
  constructor(
    message: string,
    public exitCode: number,
    public stderr: string
  ) {
    super(message);
  }
}

export function handleCLIError(error: any) {
  if (error.code === 'ENOENT') {
    return { error: 'Command not found', code: 404 };
  }
  
  if (error.signal === 'SIGTERM') {
    return { error: 'Command timeout', code: 408 };
  }
  
  return { error: 'Internal server error', code: 500 };
}
```

## 6. Client-Side Integration

### React Hook for CLI Operations
```typescript
// src/hooks/useCLI.ts
import { useState } from 'react';

export function useCLI() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  
  const execute = async (command: string, args: string[]) => {
    setLoading(true);
    try {
      const response = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, args })
      });
      
      const result = await response.json();
      setOutput(result.output);
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  const executeStream = (command: string, args: string[]) => {
    const eventSource = new EventSource('/api/cli/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.data) {
        setOutput(prev => prev + data.data);
      }
    };
    
    return eventSource;
  };
  
  return { execute, executeStream, loading, output };
}
```

## 7. Performance Optimization

### Command Caching
```typescript
// src/lib/command-cache.ts
const cache = new Map<string, { result: any; timestamp: number }>();

export function getCachedResult(key: string, ttl = 300000) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.result;
  }
  return null;
}

export function setCachedResult(key: string, result: any) {
  cache.set(key, { result, timestamp: Date.now() });
}
```

### Process Pool Management
```typescript
// src/lib/process-pool.ts
export class ProcessPool {
  private pool: Array<{ busy: boolean; process?: any }> = [];
  private maxSize = 5;
  
  async getProcess() {
    let available = this.pool.find(p => !p.busy);
    
    if (!available && this.pool.length < this.maxSize) {
      available = { busy: false };
      this.pool.push(available);
    }
    
    if (available) {
      available.busy = true;
      return available;
    }
    
    throw new Error('No available processes');
  }
  
  releaseProcess(process: any) {
    const poolItem = this.pool.find(p => p.process === process);
    if (poolItem) {
      poolItem.busy = false;
    }
  }
}
```

## 8. Monitoring and Logging

### CLI Operation Logger
```typescript
// src/lib/logger.ts
export class CLILogger {
  static log(operation: string, command: string, duration: number, success: boolean) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      operation,
      command,
      duration,
      success,
      level: success ? 'info' : 'error'
    }));
  }
}
```

## Best Practices Summary

1. **Always validate input** - Use schema validation for all CLI parameters
2. **Implement timeouts** - Prevent hanging processes
3. **Use allowlists** - Only permit specific commands
4. **Sanitize environment** - Control environment variables
5. **Rate limiting** - Prevent abuse
6. **Proper error handling** - Return meaningful error messages
7. **Logging** - Track all CLI operations
8. **Resource cleanup** - Ensure processes are properly terminated
9. **Streaming for long operations** - Use Server-Sent Events for real-time feedback
10. **Caching** - Cache results when appropriate

This pattern provides a secure, scalable foundation for CLI integration in your NimbusAI application.