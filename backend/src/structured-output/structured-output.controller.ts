import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { StructuredOutputService } from './structured-output.service';
import { ParsePersonDto, ParsePersonResponseDto } from './dto/parse-person.dto';
import {
  ExtractInvoiceDto,
  ExtractInvoiceResponseDto,
} from './dto/extract-invoice.dto';
import {
  GenericExtractDto,
  GenericExtractResponseDto,
} from './dto/generic-extract.dto';

/**
 * Structured Output Controller
 * API endpoints cho structured output exercises
 */
@ApiTags('structured-output')
@Controller('structured-output')
export class StructuredOutputController {
  constructor(
    private readonly structuredOutputService: StructuredOutputService,
  ) {}

  @Post('parse-person')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bài 1: Parse Person',
    description: 'Trích xuất thông tin người từ text thành Person object',
  })
  @ApiBody({ type: ParsePersonDto })
  @ApiResponse({
    status: 200,
    description: 'Person parsed successfully',
    type: ParsePersonResponseDto,
  })
  async parsePerson(@Body() dto: ParsePersonDto) {
    return this.structuredOutputService.parsePerson(dto.text, dto.method);
  }

  @Post('extract-invoice')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bài 2: Extract Invoice',
    description: 'Trích xuất thông tin hóa đơn từ text thành Invoice object',
  })
  @ApiBody({ type: ExtractInvoiceDto })
  @ApiResponse({
    status: 200,
    description: 'Invoice extracted successfully',
    type: ExtractInvoiceResponseDto,
  })
  async extractInvoice(@Body() dto: ExtractInvoiceDto) {
    return this.structuredOutputService.extractInvoice(
      dto.invoiceText,
      dto.method,
    );
  }

  @Post('extract')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bài 3: Generic Extraction',
    description:
      'Trích xuất thông tin từ text với custom Zod schema (JSON Schema string)',
  })
  @ApiBody({ type: GenericExtractDto })
  @ApiResponse({
    status: 200,
    description: 'Data extracted successfully',
    type: GenericExtractResponseDto,
  })
  async genericExtract(@Body() dto: GenericExtractDto) {
    return this.structuredOutputService.genericExtract(
      dto.text,
      dto.schema,
      dto.method,
    );
  }
}
