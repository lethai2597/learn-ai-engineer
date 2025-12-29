import { Injectable } from '@nestjs/common';
import { OpenRouterService } from '../prompt-engineering/services/openrouter.service';
import { ToolRegistry } from '../function-calling/tools/tool.registry';
import { calculatorTool } from '../function-calling/tools/calculator.tool';
import { searchWebTool } from '../function-calling/tools/assistant.tools';
import {
  ReactCalculatorRequestDto,
  ReactCalculatorResponseDto,
} from './dto/react-calculator.dto';
import {
  ReactResearchRequestDto,
  ReactResearchResponseDto,
} from './dto/react-research.dto';
import { ReActStep } from './workflow/react-workflow.types';
import OpenAI from 'openai';

@Injectable()
export class ReactPatternService {
  private calculatorRegistry: ToolRegistry;
  private researchRegistry: ToolRegistry;

  constructor(private readonly openRouterService: OpenRouterService) {
    this.calculatorRegistry = new ToolRegistry();
    this.calculatorRegistry.register(calculatorTool);

    this.researchRegistry = new ToolRegistry();
    this.researchRegistry.register(searchWebTool);
  }

  // agents-react-pattern-01
  async calculator(
    dto: ReactCalculatorRequestDto,
  ): Promise<ReactCalculatorResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();
    const maxIterations = dto.maxIterations || 10;

    // [BUSINESS] ReAct Pattern: Reasoning + Acting
    // System message hướng dẫn agent suy nghĩ trước khi hành động
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'Bạn là một agent toán học thông minh. Bạn có thể giải quyết các bài toán nhiều bước bằng cách sử dụng tool calculate. QUAN TRỌNG: Sau khi đã tính toán xong tất cả các bước cần thiết, bạn PHẢI trả về câu trả lời cuối cùng mà KHÔNG gọi tool nữa. Nếu bạn đã có kết quả cuối cùng, hãy trả về câu trả lời trực tiếp thay vì gọi tool thêm lần nữa.',
      },
      {
        role: 'user',
        content: dto.query,
      },
    ];

    const steps: ReActStep[] = [];
    const tools = this.calculatorRegistry.getAllSchemas();
    const executedToolCalls = new Set<string>();
    let iterations = 0;

    // [BUSINESS] ReAct loop: Thought → Action → Observation → Thought → ...
    while (iterations < maxIterations) {
      // [BUSINESS] Thought: LLM suy nghĩ và quyết định action
      const response =
        await this.openRouterService.generateFunctionCallCompletion(
          messages,
          tools,
          {
            model: 'anthropic/claude-3.5-sonnet',
            temperature: 0.3,
            maxTokens: 500,
          },
        );

      // [BUSINESS] Nếu không có tool call, agent đã có câu trả lời cuối cùng
      if (!response.toolCalls || response.toolCalls.length === 0) {
        const finalStep: ReActStep = {
          thought: response.content || undefined,
        };
        steps.push(finalStep);
        messages.push({
          role: 'assistant',
          content: response.content || '',
        });
        break;
      }

      const toolCall = response.toolCalls[0];
      if (toolCall.type !== 'function' || !('function' in toolCall)) {
        break;
      }

      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      const toolCallKey = `${functionName}:${JSON.stringify(args)}`;

      // [BUSINESS] Tránh gọi lại tool đã execute
      if (executedToolCalls.has(toolCallKey)) {
        messages.push({
          role: 'assistant',
          content:
            'Tôi đã thực hiện tool call này rồi. Tôi sẽ trả về câu trả lời cuối cùng dựa trên kết quả đã có.',
        });
        break;
      }

      executedToolCalls.add(toolCallKey);

      // [BUSINESS] Action: Tạo step với thought và action
      const step: ReActStep = {
        thought: response.content || undefined,
        action: {
          functionName,
          arguments: args,
        },
      };

      messages.push({
        role: 'assistant',
        content: null,
        tool_calls: [
          {
            id: toolCall.id,
            type: 'function',
            function: {
              name: functionName,
              arguments: toolCall.function.arguments,
            },
          },
        ],
      });

      // [BUSINESS] Observation: Execute tool và nhận kết quả
      let observation: any;
      try {
        observation = await this.calculatorRegistry.execute(functionName, args);
      } catch (error) {
        observation = {
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      step.observation = observation;
      steps.push(step);

      // [BUSINESS] Thêm observation vào conversation để agent suy nghĩ tiếp
      messages.push({
        role: 'tool',
        content: JSON.stringify(observation),
        tool_call_id: toolCall.id,
      });

      iterations++;
    }

    // [BUSINESS] Final response: Tổng hợp tất cả steps và trả về câu trả lời cuối cùng
    const finalResponse = await this.openRouterService.generateCompletion(
      messages,
      {
        model: 'anthropic/claude-3.5-sonnet',
        temperature: 0.7,
        maxTokens: 500,
      },
    );

    // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
    const latency = Date.now() - startTime;

    return {
      steps,
      finalResponse: finalResponse.trim(),
      latency,
      iterations,
    };
  }

  // agents-react-pattern-02
  async research(
    dto: ReactResearchRequestDto,
  ): Promise<ReactResearchResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();
    const maxIterations = dto.maxIterations || 5;

    // [BUSINESS] ReAct Pattern cho research agent
    // Agent sẽ tìm kiếm thông tin và tổng hợp kết quả
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'Bạn là một research agent thông minh. Bạn có thể tìm kiếm thông tin và tổng hợp kết quả. Sử dụng tool searchWeb để tìm kiếm thông tin khi cần thiết. QUAN TRỌNG: Sau khi đã tìm kiếm 2-3 lần, bạn PHẢI tổng hợp thông tin và trả về câu trả lời cuối cùng mà KHÔNG gọi tool nữa. Đừng tìm kiếm quá nhiều lần - hãy tổng hợp và trả lời dựa trên thông tin đã có.',
      },
      {
        role: 'user',
        content: dto.query,
      },
    ];

    const steps: ReActStep[] = [];
    const tools = this.researchRegistry.getAllSchemas();
    const executedToolCalls = new Set<string>();
    let iterations = 0;
    const maxSearchIterations = 3;

    // [BUSINESS] ReAct loop với giới hạn số lần search
    while (iterations < maxIterations) {
      // [BUSINESS] Nếu đã search đủ, yêu cầu agent tổng hợp
      if (iterations >= maxSearchIterations) {
        messages.push({
          role: 'system',
          content:
            'Bạn đã tìm kiếm đủ thông tin. Hãy tổng hợp và trả về câu trả lời cuối cùng mà KHÔNG gọi tool nữa.',
        });
      }

      // [BUSINESS] Thought: LLM suy nghĩ về query và quyết định search gì
      const response =
        await this.openRouterService.generateFunctionCallCompletion(
          messages,
          tools,
          {
            model: 'anthropic/claude-3.5-sonnet',
            temperature: 0.3,
            maxTokens: 500,
          },
        );

      if (!response.toolCalls || response.toolCalls.length === 0) {
        const finalStep: ReActStep = {
          thought: response.content || undefined,
        };
        steps.push(finalStep);
        messages.push({
          role: 'assistant',
          content: response.content || '',
        });
        break;
      }

      // [BUSINESS] Nếu đã search đủ, dừng lại
      if (iterations >= maxSearchIterations) {
        messages.push({
          role: 'assistant',
          content:
            'Tôi đã tìm kiếm đủ thông tin. Tôi sẽ tổng hợp và trả về câu trả lời cuối cùng dựa trên kết quả đã có.',
        });
        break;
      }

      const toolCall = response.toolCalls[0];
      if (toolCall.type !== 'function' || !('function' in toolCall)) {
        break;
      }

      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      const toolCallKey = `${functionName}:${JSON.stringify(args)}`;

      if (executedToolCalls.has(toolCallKey)) {
        messages.push({
          role: 'assistant',
          content:
            'Tôi đã thực hiện tool call này rồi. Tôi sẽ trả về câu trả lời cuối cùng dựa trên kết quả đã có.',
        });
        break;
      }

      executedToolCalls.add(toolCallKey);

      // [BUSINESS] Action: Tạo step với thought và search action
      const step: ReActStep = {
        thought: response.content || undefined,
        action: {
          functionName,
          arguments: args,
        },
      };

      messages.push({
        role: 'assistant',
        content: null,
        tool_calls: [
          {
            id: toolCall.id,
            type: 'function',
            function: {
              name: functionName,
              arguments: toolCall.function.arguments,
            },
          },
        ],
      });

      // [BUSINESS] Observation: Execute search và nhận kết quả
      let observation: any;
      try {
        observation = await this.researchRegistry.execute(functionName, args);
      } catch (error) {
        observation = {
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      step.observation = observation;
      steps.push(step);

      // [BUSINESS] Thêm search results vào conversation để agent tổng hợp
      messages.push({
        role: 'tool',
        content: JSON.stringify(observation),
        tool_call_id: toolCall.id,
      });

      iterations++;
    }

    // [BUSINESS] Final response: Tổng hợp tất cả search results
    const finalResponse = await this.openRouterService.generateCompletion(
      messages,
      {
        model: 'anthropic/claude-3.5-sonnet',
        temperature: 0.7,
        maxTokens: 500,
      },
    );

    // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
    const latency = Date.now() - startTime;

    return {
      steps,
      finalResponse: finalResponse.trim(),
      latency,
      iterations,
    };
  }
}
