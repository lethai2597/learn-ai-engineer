import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PromptTechnique } from '../prompts/prompt-builder';

export class SolveLogicProblemDto {
  @ApiProperty({
    description: 'Logic problem to solve',
    example:
      'If all roses are flowers, and some flowers are red, can we conclude that some roses are red?',
  })
  @IsString()
  problem: string;

  @ApiProperty({
    description: 'Prompt technique to use',
    enum: PromptTechnique,
    example: PromptTechnique.CHAIN_OF_THOUGHT,
  })
  @IsEnum(PromptTechnique)
  technique: PromptTechnique;
}

export class SolveLogicProblemResponseDto {
  @ApiProperty({ description: 'Solution to the logic problem' })
  solution: string;

  @ApiProperty({ description: 'Full AI response' })
  response: string;

  @ApiProperty({ description: 'Prompt technique used' })
  technique: string;
}
