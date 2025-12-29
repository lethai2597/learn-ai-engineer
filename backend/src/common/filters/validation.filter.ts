import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

/**
 * Validation Exception Filter
 * Transform validation errors từ class-validator thành user-friendly format
 * Áp dụng DTO Pattern với proper error handling
 */
@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as any;
    const message = exceptionResponse.message;

    const isValidationError =
      Array.isArray(message) &&
      message.some(
        (error: any) =>
          typeof error === 'object' &&
          error !== null &&
          'property' in error &&
          'constraints' in error,
      );

    if (!isValidationError) {
      const errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message:
          typeof message === 'string' ? message : JSON.stringify(message),
      };

      response.status(status).json(errorResponse);
      return;
    }

    const errors: Record<string, string[]> = {};
    message.forEach((error: ValidationError | string) => {
      if (typeof error === 'string') {
        errors['general'] = errors['general'] || [];
        errors['general'].push(error);
      } else if (error instanceof Object && 'property' in error) {
        const validationError = error;
        const property = validationError.property;
        const constraints = validationError.constraints || {};

        errors[property] = Object.values(constraints);
      }
    });

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Validation failed',
      errors,
    };

    response.status(status).json(errorResponse);
  }
}
