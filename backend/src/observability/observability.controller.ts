import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ObservabilityService } from './observability.service';
import { CreateLLMLogDto, QueryLogsDto } from './dto/llm-log.dto';

@ApiTags('Observability')
@Controller('observability')
export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  @Post('logs')
  @ApiOperation({ summary: 'Create LLM log entry' })
  @ApiResponse({ status: 201, description: 'Log created successfully' })
  async createLog(@Body() dto: CreateLLMLogDto) {
    await this.observabilityService.logLLMCall({
      timestamp: new Date().toISOString(),
      ...dto,
    });
    return { message: 'Log created successfully' };
  }

  @Get('logs')
  @ApiOperation({ summary: 'Query LLM logs' })
  @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
  async getLogs(@Query() query: QueryLogsDto) {
    const filters: any = {};

    if (query.userId) {
      filters.userId = query.userId;
    }

    if (query.model) {
      filters.model = query.model;
    }

    if (query.startDate) {
      filters.startDate = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.endDate = new Date(query.endDate);
    }

    const logs = await this.observabilityService.getLogs(filters);
    return logs || [];
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get observability statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    const stats = await this.observabilityService.getStats();
    return stats;
  }
}
