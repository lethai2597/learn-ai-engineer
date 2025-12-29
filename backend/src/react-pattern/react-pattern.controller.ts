import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ReactPatternService } from './react-pattern.service';
import {
  ReactCalculatorRequestDto,
  ReactCalculatorResponseDto,
} from './dto/react-calculator.dto';
import {
  ReactResearchRequestDto,
  ReactResearchResponseDto,
} from './dto/react-research.dto';

@ApiTags('react-pattern')
@Controller('react-pattern')
export class ReactPatternController {
  constructor(private readonly reactPatternService: ReactPatternService) {}

  @Post('calculator')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ReAct Calculator Agent',
    description:
      'Agent giải quyết bài toán toán học nhiều bước bằng ReAct pattern',
  })
  @ApiBody({ type: ReactCalculatorRequestDto })
  @ApiResponse({
    status: 200,
    description: 'ReAct calculator result',
    type: ReactCalculatorResponseDto,
  })
  async calculator(
    @Body() dto: ReactCalculatorRequestDto,
  ): Promise<ReactCalculatorResponseDto> {
    return await this.reactPatternService.calculator(dto);
  }

  @Post('research')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ReAct Research Agent',
    description: 'Agent tìm kiếm và tổng hợp thông tin bằng ReAct pattern',
  })
  @ApiBody({ type: ReactResearchRequestDto })
  @ApiResponse({
    status: 200,
    description: 'ReAct research result',
    type: ReactResearchResponseDto,
  })
  async research(
    @Body() dto: ReactResearchRequestDto,
  ): Promise<ReactResearchResponseDto> {
    return await this.reactPatternService.research(dto);
  }
}
