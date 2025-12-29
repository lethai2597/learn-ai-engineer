import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChainsRoutingService } from './chains-routing.service';
import {
  SimpleChainRequestDto,
  SimpleChainResponseDto,
} from './dto/simple-chain.dto';
import { RouterRequestDto, RouterResponseDto } from './dto/router.dto';
import {
  ConditionalChainRequestDto,
  ConditionalChainResponseDto,
} from './dto/conditional-chain.dto';

@ApiTags('chains-routing')
@Controller('chains-routing')
export class ChainsRoutingController {
  constructor(private readonly chainsRoutingService: ChainsRoutingService) {}

  @Post('simple-chain')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Simple Chain',
    description:
      'Xử lý text qua chain: Translate → Summarize → Extract keywords',
  })
  @ApiBody({ type: SimpleChainRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Chain execution result',
    type: SimpleChainResponseDto,
  })
  async simpleChain(
    @Body() dto: SimpleChainRequestDto,
  ): Promise<SimpleChainResponseDto> {
    return await this.chainsRoutingService.simpleChain(dto);
  }

  @Post('router')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Router Pattern',
    description: 'Phân loại intent và route đến model phù hợp',
  })
  @ApiBody({ type: RouterRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Router result',
    type: RouterResponseDto,
  })
  async routeRequest(
    @Body() dto: RouterRequestDto,
  ): Promise<RouterResponseDto> {
    return await this.chainsRoutingService.routeRequest(dto);
  }

  @Post('conditional-chain')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Conditional Chain',
    description:
      'Xử lý document với conditional logic: Detect language → Translate (nếu cần) → Summarize → Extract entities',
  })
  @ApiBody({ type: ConditionalChainRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Conditional chain result',
    type: ConditionalChainResponseDto,
  })
  async processDocument(
    @Body() dto: ConditionalChainRequestDto,
  ): Promise<ConditionalChainResponseDto> {
    return await this.chainsRoutingService.processDocument(dto);
  }
}
