import { spawn } from 'child_process';

export interface CLIResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
}

export class NimbusCLI {
  private readonly allowedCommands = ['kiro-cli', 'terraform', 'aws'];
  private readonly timeout = 30000;

  async executeKiroCommand(args: string[]): Promise<CLIResult> {
    return this.execute('kiro-cli', args);
  }

  async generateArchitecture(prompt: string): Promise<any> {
    const result = await this.executeKiroCommand([
      'generate',
      '--prompt', prompt,
      '--format', 'json'
    ]);
    
    return JSON.parse(result.stdout);
  }

  async validateTerraform(workDir: string): Promise<CLIResult> {
    return this.execute('terraform', ['validate'], { cwd: workDir });
  }

  private async execute(
    command: string, 
    args: string[], 
    options: { cwd?: string } = {}
  ): Promise<CLIResult> {
    const startTime = Date.now();
    
    if (!this.allowedCommands.includes(command)) {
      throw new Error(`Command not allowed: ${command}`);
    }

    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: this.timeout,
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, NODE_ENV: 'production' }
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => stdout += data.toString());
      child.stderr?.on('data', (data) => stderr += data.toString());

      child.on('close', (code) => {
        resolve({
          stdout,
          stderr,
          exitCode: code || 0,
          duration: Date.now() - startTime
        });
      });

      child.on('error', reject);
    });
  }
}