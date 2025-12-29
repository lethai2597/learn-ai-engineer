import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LocalModelsService } from './local-models.service';
import { ChatDto, ChatResponseDto } from './dto/chat.dto';

@ApiTags('local-models')
@Controller('local-models')
export class LocalModelsController {
  constructor(private readonly localModelsService: LocalModelsService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chat với Local Model (Ollama)',
    description: 'Gửi message đến local model thông qua Ollama API',
  })
  @ApiBody({ type: ChatDto })
  @ApiResponse({
    status: 200,
    description: 'Chat response từ local model',
    type: ChatResponseDto,
  })
  async chat(@Body() dto: ChatDto) {
    return this.localModelsService.chat(dto.message, dto.model);
  }

  @Get('models')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List available local models',
    description: 'Lấy danh sách các models đã được pull trong Ollama',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available models',
    type: [String],
  })
  async listModels() {
    const models = await this.localModelsService.listModels();
    return { models };
  }
}
