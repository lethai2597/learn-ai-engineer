import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MemoryManagementService } from './memory-management.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ChatMessageDto } from './dto/chat-message.dto';

@ApiTags('memory-management')
@Controller('memory-management')
export class MemoryManagementController {
  constructor(
    private readonly memoryManagementService: MemoryManagementService,
  ) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chat với memory management',
    description:
      'Gửi message và nhận response với memory strategy được áp dụng',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat response với memory',
    type: ChatResponseDto,
  })
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    return await this.memoryManagementService.chat(dto);
  }

  @Get('sessions/:sessionId')
  @ApiOperation({
    summary: 'Lấy lịch sử conversation',
    description: 'Lấy toàn bộ messages trong session',
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Message history',
    type: [ChatMessageDto],
  })
  async getSession(
    @Param('sessionId') sessionId: string,
  ): Promise<ChatMessageDto[]> {
    return await this.memoryManagementService.getSession(sessionId);
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa session',
    description: 'Xóa toàn bộ lịch sử conversation của session',
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Session đã được xóa',
  })
  async deleteSession(@Param('sessionId') sessionId: string): Promise<void> {
    return await this.memoryManagementService.deleteSession(sessionId);
  }
}
