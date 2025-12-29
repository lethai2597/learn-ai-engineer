import { Injectable, BadRequestException } from '@nestjs/common';
import { OpenRouterService } from '../prompt-engineering/services/openrouter.service';
import { PersonSchema } from './schemas/person.schema';
import { InvoiceSchema } from './schemas/invoice.schema';
import { ExtractionMethod } from './dto/parse-person.dto';
import { z } from 'zod';
import OpenAI from 'openai';

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type ChatTool = OpenAI.Chat.Completions.ChatCompletionTool;

/**
 * Structured Output Service
 * Business logic cho structured output extraction
 *
 * Design Pattern: Strategy Pattern
 * - Chọn extraction strategy (JSON Mode vs Function Calling) dựa trên method
 */
@Injectable()
export class StructuredOutputService {
  constructor(private readonly openRouterService: OpenRouterService) {}

  private zodToJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
    if (schema instanceof z.ZodObject) {
      const shape = schema.shape;
      const properties: Record<string, unknown> = {};
      const required: string[] = [];

      for (const [key, value] of Object.entries(shape)) {
        properties[key] = this.zodToJsonSchema(value as z.ZodTypeAny);
        if (!(value instanceof z.ZodOptional)) {
          required.push(key);
        }
      }

      return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
      };
    }

    if (schema instanceof z.ZodString) {
      return { type: 'string' };
    }

    if (schema instanceof z.ZodNumber) {
      return { type: 'number' };
    }

    if (schema instanceof z.ZodBoolean) {
      return { type: 'boolean' };
    }

    if (schema instanceof z.ZodArray) {
      return {
        type: 'array',
        items: this.zodToJsonSchema(schema.element as z.ZodTypeAny),
      };
    }

    if (schema instanceof z.ZodOptional) {
      return this.zodToJsonSchema(schema.unwrap() as z.ZodTypeAny);
    }

    if (schema instanceof z.ZodEnum) {
      return {
        type: 'string',
        enum: schema.options,
      };
    }

    return { type: 'string' };
  }

  private async extractWithJsonMode<T extends z.ZodTypeAny>(
    text: string,
    schema: T,
    systemPrompt: string,
  ): Promise<{
    data: z.infer<T>;
    rawResponse: string;
  }> {
    const userPrompt = `Trích xuất thông tin từ text sau và trả về dưới dạng JSON hợp lệ:\n\n${text}`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `${systemPrompt}\n\nLưu ý: Bạn PHẢI trả về JSON hợp lệ, không có text thêm.`,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    const rawResponse =
      await this.openRouterService.generateJSONCompletion(messages);

    if (!rawResponse || rawResponse.trim().length === 0) {
      throw new BadRequestException(
        'API trả về response rỗng. Vui lòng thử lại.',
      );
    }

    let jsonData: unknown;
    try {
      jsonData = JSON.parse(rawResponse);
    } catch (error) {
      throw new BadRequestException(
        `Không thể parse JSON từ response: ${error instanceof Error ? error.message : 'Invalid JSON'}. Raw response: ${rawResponse.substring(0, 200)}`,
      );
    }

    let validatedData: z.infer<T>;
    try {
      validatedData = schema.parse(jsonData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
          return `${path}: ${issue.message}`;
        });
        throw new BadRequestException(
          `Dữ liệu không khớp với schema: ${errorMessages.join('; ')}`,
        );
      }
      throw new BadRequestException(
        `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return {
      data: validatedData,
      rawResponse,
    };
  }

  private async extractWithFunctionCalling<T extends z.ZodTypeAny>(
    text: string,
    schema: T,
    systemPrompt: string,
    functionName: string = 'extract_data',
  ): Promise<{
    data: z.infer<T>;
    rawResponse: string;
  }> {
    const jsonSchema = this.zodToJsonSchema(schema);

    const tools: ChatTool[] = [
      {
        type: 'function',
        function: {
          name: functionName,
          description: systemPrompt,
          parameters: jsonSchema,
        },
      },
    ];

    const userPrompt = `Trích xuất thông tin từ text sau:\n\n${text}`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    const result = await this.openRouterService.generateFunctionCallCompletion(
      messages,
      tools,
    );

    if (result.toolCalls.length === 0) {
      throw new BadRequestException(
        'API không trả về tool calls. Model có thể không gọi function. Vui lòng thử lại.',
      );
    }

    const toolCall = result.toolCalls[0];
    if (toolCall.type !== 'function') {
      throw new BadRequestException('Format tool call không hợp lệ');
    }

    const argumentsStr = toolCall.function.arguments;
    if (!argumentsStr || argumentsStr.trim().length === 0) {
      throw new BadRequestException(
        'Function arguments rỗng. Vui lòng thử lại.',
      );
    }

    const rawResponse = argumentsStr;

    let jsonData: unknown;
    try {
      jsonData = JSON.parse(argumentsStr);
    } catch (error) {
      throw new BadRequestException(
        `Không thể parse JSON từ function arguments: ${error instanceof Error ? error.message : 'Invalid JSON'}. Raw arguments: ${argumentsStr.substring(0, 200)}`,
      );
    }

    let validatedData: z.infer<T>;
    try {
      validatedData = schema.parse(jsonData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
          return `${path}: ${issue.message}`;
        });
        throw new BadRequestException(
          `Dữ liệu không khớp với schema: ${errorMessages.join('; ')}`,
        );
      }
      throw new BadRequestException(
        `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return {
      data: validatedData,
      rawResponse,
    };
  }

  // llm-fundamentals-structured-output-01
  async parsePerson(
    text: string,
    method: ExtractionMethod,
  ): Promise<{
    data: z.infer<typeof PersonSchema>;
    rawResponse: string;
    method: string;
  }> {
    if (!text || text.trim().length === 0) {
      throw new BadRequestException('Text không được để trống');
    }

    // [BUSINESS] System prompt hướng dẫn LLM cách extract thông tin
    const systemPrompt =
      'Bạn là một AI chuyên trích xuất thông tin cá nhân từ text. Hãy trích xuất thông tin về tên, tuổi, kỹ năng, email và tiểu sử (nếu có).';

    try {
      let result: { data: z.infer<typeof PersonSchema>; rawResponse: string };

      // [BUSINESS] Chọn extraction method: JSON Mode hoặc Function Calling
      // JSON Mode: LLM trả về JSON trực tiếp
      // Function Calling: LLM gọi function với schema được định nghĩa
      if (method === ExtractionMethod.JSON_MODE) {
        result = await this.extractWithJsonMode(
          text,
          PersonSchema,
          systemPrompt,
        );
      } else {
        result = await this.extractWithFunctionCalling(
          text,
          PersonSchema,
          systemPrompt,
          'extract_person',
        );
      }

      return {
        ...result,
        method,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Không thể trích xuất thông tin người: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // llm-fundamentals-structured-output-02
  async extractInvoice(
    invoiceText: string,
    method: ExtractionMethod,
  ): Promise<{
    data: z.infer<typeof InvoiceSchema>;
    rawResponse: string;
    method: string;
  }> {
    if (!invoiceText || invoiceText.trim().length === 0) {
      throw new BadRequestException('Invoice text không được để trống');
    }

    // [BUSINESS] System prompt hướng dẫn LLM cách extract thông tin hóa đơn
    const systemPrompt =
      'Bạn là một AI chuyên trích xuất thông tin hóa đơn từ text. Hãy trích xuất số hóa đơn, ngày, tên khách hàng, danh sách sản phẩm/dịch vụ, tổng tiền, thuế và các thông tin khác (nếu có).';

    try {
      let result: { data: z.infer<typeof InvoiceSchema>; rawResponse: string };

      // [BUSINESS] Chọn extraction method: JSON Mode hoặc Function Calling
      // Sử dụng InvoiceSchema để validate output
      if (method === ExtractionMethod.JSON_MODE) {
        result = await this.extractWithJsonMode(
          invoiceText,
          InvoiceSchema,
          systemPrompt,
        );
      } else {
        result = await this.extractWithFunctionCalling(
          invoiceText,
          InvoiceSchema,
          systemPrompt,
          'extract_invoice',
        );
      }

      return {
        ...result,
        method,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Không thể trích xuất thông tin hóa đơn: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // llm-fundamentals-structured-output-03
  async genericExtract(
    text: string,
    schemaString: string,
    method: ExtractionMethod,
  ): Promise<{
    data: Record<string, unknown>;
    rawResponse: string;
    method: string;
    errors?: string[];
  }> {
    // [BUSINESS] Parse schema từ string (Zod schema string)
    // Lưu ý: Đây là approach đơn giản, trong production nên có validation chặt chẽ hơn
    let schema: z.ZodTypeAny;
    try {
      // [BUSINESS] Eval schema string để tạo Zod schema object
      // Cách an toàn hơn: sử dụng JSON Schema và convert sang Zod
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const schemaFunction = new Function('z', `return ${schemaString}`);
      schema = schemaFunction(z);
    } catch (error) {
      throw new BadRequestException(
        `Invalid schema: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    // [BUSINESS] Validate schema là ZodType
    if (!(schema instanceof z.ZodType)) {
      throw new BadRequestException('Schema must be a valid Zod schema');
    }

    // [BUSINESS] System prompt hướng dẫn LLM extract theo custom schema
    const systemPrompt =
      'Bạn là một AI chuyên trích xuất thông tin từ text theo schema được định nghĩa. Hãy trích xuất chính xác các thông tin theo yêu cầu.';

    let result: { data: unknown; rawResponse: string };
    const errors: string[] = [];

    try {
      // [BUSINESS] Chọn extraction method với custom schema
      // Generic extraction cho phép user tự định nghĩa schema
      if (method === ExtractionMethod.JSON_MODE) {
        result = await this.extractWithJsonMode(text, schema, systemPrompt);
      } else {
        result = await this.extractWithFunctionCalling(
          text,
          schema,
          systemPrompt,
          'extract_data',
        );
      }
    } catch (error) {
      errors.push(
        error instanceof Error ? error.message : 'Unknown extraction error',
      );
      throw new BadRequestException(`Extraction failed: ${errors.join(', ')}`);
    }

    return {
      data: result.data as Record<string, unknown>,
      rawResponse: result.rawResponse,
      method,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
