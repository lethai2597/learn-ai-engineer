import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FunctionCallingService } from './function-calling.service';
import {
  CalculatorRequestDto,
  CalculatorResponseDto,
} from './dto/calculator.dto';
import { WeatherRequestDto, WeatherResponseDto } from './dto/weather.dto';
import { AssistantRequestDto, AssistantResponseDto } from './dto/assistant.dto';

@ApiTags('function-calling')
@Controller('function-calling')
export class FunctionCallingController {
  constructor(
    private readonly functionCallingService: FunctionCallingService,
  ) {}

  @Post('calculator')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculator Tool',
    description: 'Thực hiện phép tính toán học thông qua function calling',
  })
  @ApiBody({ type: CalculatorRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Calculator result',
    type: CalculatorResponseDto,
  })
  async calculate(
    @Body() dto: CalculatorRequestDto,
  ): Promise<CalculatorResponseDto> {
    return await this.functionCallingService.calculate(dto);
  }

  @Post('weather')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Weather Tool',
    description: 'Lấy thông tin thời tiết thông qua function calling',
  })
  @ApiBody({ type: WeatherRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Weather result',
    type: WeatherResponseDto,
  })
  async getWeather(
    @Body() dto: WeatherRequestDto,
  ): Promise<WeatherResponseDto> {
    return await this.functionCallingService.getWeather(dto);
  }

  @Post('assistant')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Multi-tool Assistant',
    description:
      'Assistant với nhiều tools khác nhau (calculator, weather, time, search)',
  })
  @ApiBody({ type: AssistantRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Assistant result',
    type: AssistantResponseDto,
  })
  async assistant(
    @Body() dto: AssistantRequestDto,
  ): Promise<AssistantResponseDto> {
    return await this.functionCallingService.assistant(dto);
  }
}
