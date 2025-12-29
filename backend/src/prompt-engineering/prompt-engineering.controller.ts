import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PromptEngineeringService } from './prompt-engineering.service';
import { PromptRequestDto } from './dto/prompt-request.dto';
import {
  ClassifyEmailDto,
  ClassifyEmailResponseDto,
} from './dto/email-classification.dto';
import { ExtractCVDto, ExtractCVResponseDto } from './dto/cv-extraction.dto';
import {
  SolveLogicProblemDto,
  SolveLogicProblemResponseDto,
} from './dto/logic-problem.dto';

/**
 * Prompt Engineering Controller
 * API endpoints cho prompt engineering exercises
 */
@ApiTags('prompt-engineering')
@Controller('prompt-engineering')
export class PromptEngineeringController {
  constructor(
    private readonly promptEngineeringService: PromptEngineeringService,
  ) {}

  @Post('test-prompt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Test generic prompt',
    description: 'Test any prompt with different techniques',
  })
  @ApiBody({ type: PromptRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Prompt test successful',
  })
  async testPrompt(@Body() dto: PromptRequestDto) {
    return this.promptEngineeringService.testPrompt(dto);
  }

  @Post('classify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bài 1: Email Classification',
    description:
      'Phân loại email thành: Technical Issue / Sales / General Inquiry',
  })
  @ApiBody({ type: ClassifyEmailDto })
  @ApiResponse({
    status: 200,
    description: 'Email classified successfully',
    type: ClassifyEmailResponseDto,
  })
  async classifyEmail(@Body() dto: ClassifyEmailDto) {
    return this.promptEngineeringService.classifyEmail(
      dto.email,
      dto.technique,
    );
  }

  @Post('extract-cv')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bài 2: CV Extraction',
    description: 'Trích xuất thông tin từ CV thành JSON',
  })
  @ApiBody({ type: ExtractCVDto })
  @ApiResponse({
    status: 200,
    description: 'CV extracted successfully',
    type: ExtractCVResponseDto,
  })
  async extractCV(@Body() dto: ExtractCVDto) {
    return this.promptEngineeringService.extractCV(dto.cvText, dto.technique);
  }

  @Post('solve-logic')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bài 3: Logic Problem Solving',
    description: 'Giải bài toán logic bằng Chain-of-Thought',
  })
  @ApiBody({ type: SolveLogicProblemDto })
  @ApiResponse({
    status: 200,
    description: 'Logic problem solved successfully',
    type: SolveLogicProblemResponseDto,
  })
  async solveLogicProblem(@Body() dto: SolveLogicProblemDto) {
    return this.promptEngineeringService.solveLogicProblem(
      dto.problem,
      dto.technique,
    );
  }
}
