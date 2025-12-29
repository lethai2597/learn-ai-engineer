import { Injectable } from '@nestjs/common';
import { OpenRouterService } from '../prompt-engineering/services/openrouter.service';
import { ToolRegistry } from './tools/tool.registry';
import { calculatorTool } from './tools/calculator.tool';
import { weatherTool } from './tools/weather.tool';
import { assistantTools } from './tools/assistant.tools';
import {
  CalculatorRequestDto,
  CalculatorResponseDto,
} from './dto/calculator.dto';
import { WeatherRequestDto, WeatherResponseDto } from './dto/weather.dto';
import {
  AssistantRequestDto,
  AssistantResponseDto,
  ToolCallDto,
} from './dto/assistant.dto';
import OpenAI from 'openai';

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

@Injectable()
export class FunctionCallingService {
  private calculatorRegistry: ToolRegistry;
  private weatherRegistry: ToolRegistry;
  private assistantRegistry: ToolRegistry;

  constructor(private readonly openRouterService: OpenRouterService) {
    this.calculatorRegistry = new ToolRegistry();
    this.calculatorRegistry.register(calculatorTool);

    this.weatherRegistry = new ToolRegistry();
    this.weatherRegistry.register(weatherTool);

    this.assistantRegistry = new ToolRegistry();
    assistantTools.forEach((tool) => this.assistantRegistry.register(tool));
  }

  // agents-function-calling-01
  async calculate(dto: CalculatorRequestDto): Promise<CalculatorResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();
    const registry = this.calculatorRegistry;
    const tools = registry.getAllSchemas();

    // [BUSINESS] Tạo initial message từ user query
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: dto.query,
      },
    ];

    // [BUSINESS] Bước 1: Gọi LLM với function calling
    // LLM sẽ phân tích query và quyết định gọi function nào với arguments nào
    const firstResponse =
      await this.openRouterService.generateFunctionCallCompletion(
        messages,
        tools,
        { temperature: 0.3, maxTokens: 500 },
      );

    if (!firstResponse.toolCalls || firstResponse.toolCalls.length === 0) {
      throw new Error(
        'LLM không gọi function. Vui lòng thử lại với query rõ ràng hơn.',
      );
    }

    // [BUSINESS] Extract function name và arguments từ tool call
    const toolCall = firstResponse.toolCalls[0];
    if (toolCall.type !== 'function' || !('function' in toolCall)) {
      throw new Error('Invalid tool call format');
    }

    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    // [BUSINESS] Bước 2: Execute function với arguments từ LLM
    // Tool registry sẽ thực thi function và trả về kết quả
    const toolResult = await registry.execute(functionName, args);

    // [BUSINESS] Bước 3: Thêm tool call và result vào conversation history
    // LLM cần biết function đã được gọi và kết quả là gì
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

    messages.push({
      role: 'tool',
      content: JSON.stringify(toolResult),
      tool_call_id: toolCall.id,
    });

    // [BUSINESS] Bước 4: Gọi LLM lần cuối để format response
    // LLM sẽ tổng hợp kết quả từ tool và trả về câu trả lời tự nhiên
    const finalResponse = await this.openRouterService.generateCompletion(
      messages,
      { temperature: 0.7, maxTokens: 200 },
    );

    // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
    const latency = Date.now() - startTime;

    return {
      functionName,
      arguments: args,
      toolResult,
      finalResponse: finalResponse.trim(),
      latency,
    };
  }

  // agents-function-calling-02
  async getWeather(dto: WeatherRequestDto): Promise<WeatherResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();
    const registry = this.weatherRegistry;
    const tools = registry.getAllSchemas();

    // [BUSINESS] Tạo initial message từ user query
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: dto.query,
      },
    ];

    // [BUSINESS] Bước 1: Gọi LLM với function calling
    // LLM sẽ phân tích query về thời tiết và quyết định gọi weather function với location
    const firstResponse =
      await this.openRouterService.generateFunctionCallCompletion(
        messages,
        tools,
        { temperature: 0.3, maxTokens: 500 },
      );

    if (!firstResponse.toolCalls || firstResponse.toolCalls.length === 0) {
      throw new Error(
        'LLM không gọi function. Vui lòng thử lại với query rõ ràng hơn.',
      );
    }

    // [BUSINESS] Extract function name và arguments từ tool call
    const toolCall = firstResponse.toolCalls[0];
    if (toolCall.type !== 'function' || !('function' in toolCall)) {
      throw new Error('Invalid tool call format');
    }

    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    // [BUSINESS] Bước 2: Execute weather function với location từ LLM
    // Tool registry sẽ gọi weather API và trả về thông tin thời tiết
    const toolResult = await registry.execute(functionName, args);

    // [BUSINESS] Bước 3: Thêm tool call và result vào conversation history
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

    messages.push({
      role: 'tool',
      content: JSON.stringify(toolResult),
      tool_call_id: toolCall.id,
    });

    // [BUSINESS] Bước 4: Gọi LLM lần cuối để format response
    // LLM sẽ tổng hợp thông tin thời tiết và trả về câu trả lời tự nhiên
    const finalResponse = await this.openRouterService.generateCompletion(
      messages,
      { temperature: 0.7, maxTokens: 200 },
    );

    // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
    const latency = Date.now() - startTime;

    return {
      functionName,
      arguments: args,
      toolResult,
      finalResponse: finalResponse.trim(),
      latency,
    };
  }

  // agents-function-calling-03
  async assistant(dto: AssistantRequestDto): Promise<AssistantResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();
    const registry = this.assistantRegistry;
    const tools = registry.getAllSchemas();

    // [BUSINESS] Tạo system message với instruction về multi-tool usage
    // Assistant có thể sử dụng nhiều tools: calculator, weather, time, search
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'Bạn là một assistant thông minh có thể sử dụng nhiều tools để trả lời câu hỏi của user. QUAN TRỌNG: Mỗi tool chỉ nên được gọi MỘT LẦN với mỗi bộ arguments cụ thể. Nếu bạn đã gọi một tool với arguments nhất định, KHÔNG được gọi lại tool đó với cùng arguments. Hãy kiểm tra kỹ các tool calls đã thực hiện trước khi gọi tool mới.',
      },
      {
        role: 'user',
        content: dto.query,
      },
    ];

    const toolCalls: ToolCallDto[] = [];
    const executedToolCalls = new Set<string>();
    const maxIterations = 5;
    let iteration = 0;

    // [BUSINESS] Loop để gọi nhiều tools nếu cần
    // Multi-tool assistant có thể cần gọi nhiều tools để trả lời một query
    while (iteration < maxIterations) {
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
        break;
      }

      let hasNewToolCall = false;

      // [BUSINESS] Xử lý từng tool call trong response
      // LLM có thể gọi nhiều tools cùng lúc
      for (const toolCall of response.toolCalls) {
        if (toolCall.type !== 'function' || !('function' in toolCall)) {
          continue;
        }

        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        const toolCallKey = `${functionName}:${JSON.stringify(args)}`;

        // [BUSINESS] Tránh gọi lại tool đã execute với cùng arguments
        if (executedToolCalls.has(toolCallKey)) {
          continue;
        }

        executedToolCalls.add(toolCallKey);
        hasNewToolCall = true;

        // [BUSINESS] Execute tool và lưu kết quả
        const result = await registry.execute(functionName, args);

        toolCalls.push({
          functionName,
          arguments: args,
          result,
        });

        // [BUSINESS] Thêm tool call và result vào conversation history
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

        messages.push({
          role: 'tool',
          content: JSON.stringify(result),
          tool_call_id: toolCall.id,
        });
      }

      if (!hasNewToolCall) {
        break;
      }

      iteration++;
    }

    // [BUSINESS] Gọi LLM lần cuối để tổng hợp kết quả từ tất cả tools
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
      toolCalls,
      finalResponse: finalResponse.trim(),
      latency,
    };
  }
}
