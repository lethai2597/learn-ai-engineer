import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * App Controller - Demo controller với Swagger documentation
 * Áp dụng API Design Guide của Google với proper documentation
 */
@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get hello message',
    description: 'Trả về message chào mừng',
  })
  @ApiResponse({ status: 200, description: 'Thành công', type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
