import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ExtractionMethod {
  JSON_MODE = 'json-mode',
  FUNCTION_CALLING = 'function-calling',
}

export class ParsePersonDto {
  @ApiProperty({
    description: 'Text containing person information',
    example:
      'Nguyễn Văn An là một lập trình viên full-stack 28 tuổi với 5 năm kinh nghiệm. Anh ấy có kỹ năng về JavaScript, TypeScript, React, Node.js, và Python. Email của anh ấy là nguyenvanan@example.com. Anh ấy đã làm việc tại nhiều công ty công nghệ và có niềm đam mê với AI và machine learning.',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Extraction method to use',
    enum: ExtractionMethod,
    example: ExtractionMethod.JSON_MODE,
  })
  @IsEnum(ExtractionMethod)
  method: ExtractionMethod;
}

export class ParsePersonResponseDto {
  @ApiProperty({ description: 'Parsed person data' })
  data: {
    name: string;
    age: number;
    skills: string[];
    email?: string;
    bio?: string;
  };

  @ApiProperty({ description: 'Raw response from LLM' })
  rawResponse: string;

  @ApiProperty({ description: 'Extraction method used' })
  method: string;
}
