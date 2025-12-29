import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FineTuningService } from './fine-tuning.service';
import {
  ValidateDatasetDto,
  ValidateDatasetResponseDto,
} from './dto/validate-dataset.dto';
import {
  PrepareDatasetDto,
  PrepareDatasetResponseDto,
} from './dto/prepare-dataset.dto';

@ApiTags('fine-tuning')
@Controller('fine-tuning')
export class FineTuningController {
  constructor(private readonly fineTuningService: FineTuningService) {}

  @Post('validate-dataset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate Fine-tuning Dataset',
    description:
      'Kiểm tra dataset có hợp lệ để fine-tune không. Validate format, số lượng examples, token count, và các best practices.',
  })
  @ApiBody({ type: ValidateDatasetDto })
  @ApiResponse({
    status: 200,
    description: 'Dataset validation result',
    type: ValidateDatasetResponseDto,
  })
  validateDataset(@Body() dto: ValidateDatasetDto) {
    return this.fineTuningService.validateDataset(dto);
  }

  @Post('prepare-dataset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Prepare Dataset cho Fine-tuning',
    description:
      'Convert dataset thành JSONL format để upload lên OpenAI Fine-tuning API. Dataset phải pass validation trước.',
  })
  @ApiBody({ type: PrepareDatasetDto })
  @ApiResponse({
    status: 200,
    description: 'JSONL content ready to upload',
    type: PrepareDatasetResponseDto,
  })
  async prepareDataset(@Body() dto: PrepareDatasetDto) {
    return this.fineTuningService.prepareDataset(dto);
  }
}
