import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import {
  DetectInjectionRequestDto,
  DetectInjectionResponseDto,
} from './dto/prompt-injection.dto';
import {
  ModerateContentRequestDto,
  ModerateContentResponseDto,
} from './dto/content-moderation.dto';
import {
  DetectPiiRequestDto,
  DetectPiiResponseDto,
  RedactPiiRequestDto,
  RedactPiiResponseDto,
} from './dto/pii-detection.dto';
import {
  CheckRateLimitRequestDto,
  CheckRateLimitResponseDto,
} from './dto/rate-limit.dto';

@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('detect-injection')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Detect prompt injection',
    description: 'Phát hiện prompt injection attempts trong text',
  })
  @ApiBody({ type: DetectInjectionRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Prompt injection detection result',
    type: DetectInjectionResponseDto,
  })
  detectInjection(
    @Body() dto: DetectInjectionRequestDto,
  ): Promise<DetectInjectionResponseDto> {
    return this.securityService.detectInjection(dto.text);
  }

  @Post('moderate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Moderate content',
    description: 'Kiểm tra nội dung có vi phạm không',
  })
  @ApiBody({ type: ModerateContentRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Content moderation result',
    type: ModerateContentResponseDto,
  })
  async moderateContent(
    @Body() dto: ModerateContentRequestDto,
  ): Promise<ModerateContentResponseDto> {
    return this.securityService.moderateContent(dto.text);
  }

  @Post('detect-pii')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Detect PII',
    description: 'Phát hiện thông tin cá nhân (PII) trong text',
  })
  @ApiBody({ type: DetectPiiRequestDto })
  @ApiResponse({
    status: 200,
    description: 'PII detection result',
    type: DetectPiiResponseDto,
  })
  detectPii(@Body() dto: DetectPiiRequestDto): Promise<DetectPiiResponseDto> {
    return this.securityService.detectPii(dto.text);
  }

  @Post('redact-pii')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Redact PII',
    description: 'Xóa thông tin cá nhân (PII) khỏi text',
  })
  @ApiBody({ type: RedactPiiRequestDto })
  @ApiResponse({
    status: 200,
    description: 'PII redaction result',
    type: RedactPiiResponseDto,
  })
  redactPii(@Body() dto: RedactPiiRequestDto): Promise<RedactPiiResponseDto> {
    return this.securityService.redactPii(dto.text);
  }

  @Post('check-rate-limit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check rate limit',
    description: 'Kiểm tra rate limit cho identifier',
  })
  @ApiBody({ type: CheckRateLimitRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Rate limit check result',
    type: CheckRateLimitResponseDto,
  })
  checkRateLimit(
    @Body() dto: CheckRateLimitRequestDto,
  ): Promise<CheckRateLimitResponseDto> {
    return this.securityService.checkRateLimit(dto.identifier, dto.endpoint);
  }
}
