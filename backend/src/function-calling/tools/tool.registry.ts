import OpenAI from 'openai';

export interface Tool {
  name: string;
  schema: OpenAI.Chat.Completions.ChatCompletionTool;
  execute: (args: Record<string, any>) => Promise<any>;
}

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getAllSchemas(): OpenAI.Chat.Completions.ChatCompletionTool[] {
    return Array.from(this.tools.values()).map((tool) => tool.schema);
  }

  async execute(name: string, args: Record<string, any>): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool "${name}" not found`);
    }
    return await tool.execute(args);
  }
}
