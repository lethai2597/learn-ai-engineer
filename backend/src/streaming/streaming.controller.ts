import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { StreamingService } from './streaming.service';
import { StreamRequestDto } from './dto/stream-request.dto';

/**
 * Streaming Controller
 * API endpoints cho streaming responses
 */
@ApiTags('streaming')
@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Post('stream')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Streaming text response',
    description: 'Trả về streaming response sử dụng SSE (Server-Sent Events)',
  })
  @ApiBody({ type: StreamRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Streaming response (SSE format)',
  })
  async stream(
    @Body() dto: StreamRequestDto,
    @Res({ passthrough: false }) res: Response,
  ): Promise<void> {
    // Set SSE headers - MUST be set before any writes
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.setHeader('Transfer-Encoding', 'chunked');

    // Flush headers immediately
    res.flushHeaders();

    try {
      const stream = this.streamingService.streamText(dto.prompt, {
        model: dto.model,
        temperature: dto.temperature,
      });

      for await (const chunk of stream) {
        res.write(chunk);
        // Flush immediately after each chunk to prevent buffering
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
        // Also try flushHeaders if available
        if (typeof (res as any).flushHeaders === 'function') {
          (res as any).flushHeaders();
        }
      }

      res.end();
    } catch (error) {
      console.error('[Streaming Controller] Error:', error);
      res.write(
        `data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })}\n\n`,
      );
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }

  @Post('non-stream')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Non-streaming text response',
    description: 'Trả về response thông thường (không streaming) để so sánh',
  })
  @ApiBody({ type: StreamRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Non-streaming response',
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
      },
    },
  })
  async nonStream(@Body() dto: StreamRequestDto): Promise<{ text: string }> {
    const text = await this.streamingService.generateNonStreaming(dto.prompt, {
      model: dto.model,
      temperature: dto.temperature,
    });

    return { text };
  }
}
