import { Injectable, BadRequestException } from '@nestjs/common';
import { OpenRouterService } from '../../prompt-engineering/services/openrouter.service';
import OpenAI from 'openai';

@Injectable()
export class VisionService {
  constructor(private readonly openRouterService: OpenRouterService) {}

  // advanced-multimodal-01
  async analyzeImage(
    imageUrl: string,
    prompt: string = 'What is in this image? Describe in detail.',
  ): Promise<{
    analysis: string;
    model: string;
    tokens: {
      input: number;
      output: number;
      total: number;
    };
  }> {
    try {
      // [BUSINESS] Xử lý image URL: Hỗ trợ cả HTTP/HTTPS URL và base64 data URL
      let processedImageUrl = imageUrl.trim();

      if (processedImageUrl.startsWith('data:image/')) {
        // [BUSINESS] Parse và validate base64 data URL
        const base64Match = processedImageUrl.match(
          /^data:image\/([a-zA-Z+]+);base64,(.+)$/s,
        );
        if (!base64Match) {
          throw new BadRequestException(
            'Invalid base64 data URL format. Expected format: data:image/<type>;base64,<data>',
          );
        }
        const [, imageType, base64Data] = base64Match;

        if (!base64Data || base64Data.trim().length === 0) {
          throw new BadRequestException('Base64 data is empty');
        }

        const cleanedBase64 = base64Data.replace(/\s/g, '');

        // [BUSINESS] Validate image size (max 20MB)
        if (cleanedBase64.length > 20 * 1024 * 1024) {
          throw new BadRequestException(
            'Base64 image is too large. Maximum size is 20MB. Please use a smaller image or provide an HTTP/HTTPS URL.',
          );
        }

        processedImageUrl = `data:image/${imageType};base64,${cleanedBase64}`;
      } else if (
        !processedImageUrl.startsWith('http://') &&
        !processedImageUrl.startsWith('https://')
      ) {
        throw new BadRequestException(
          'Invalid image URL. Must be HTTP/HTTPS URL or base64 data URL (data:image/...)',
        );
      }

      // [BUSINESS] Tạo multimodal message với text prompt và image
      // GPT-4 Vision: Hỗ trợ text + image trong cùng một message
      const imageContent = {
        url: processedImageUrl,
      };

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: imageContent,
            },
          ],
        },
      ];

      // [BUSINESS] Gọi GPT-4 Vision model để phân tích image
      // Sử dụng GPT-4o vì có khả năng vision tốt
      const result =
        await this.openRouterService.generateCompletionWithMetadata(messages, {
          model: 'openai/gpt-4o',
          maxTokens: 1000,
        });

      return {
        analysis: result.content,
        model: result.model,
        tokens: result.tokens,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(
          `Vision analysis failed: ${error.message}`,
        );
      }
      throw new BadRequestException('Vision analysis failed');
    }
  }
}
