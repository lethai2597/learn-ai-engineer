import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import compression = require('compression');
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationFilter } from './common/filters/validation.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 4000);
  const nodeEnv = configService.get<string>('nodeEnv', 'development');
  const apiPrefix = configService.get<string>('api.prefix', 'api');
  const apiVersion = configService.get<string>('api.version', 'v1');
  const swaggerEnabled = configService.get<boolean>('swagger.enabled', true);
  const swaggerPath = configService.get<string>('swagger.path', 'api-docs');

  // Security: Helmet - Set security HTTP headers
  app.use(helmet());

  // Performance: Compression - Compress responses
  // Skip compression for streaming endpoints (SSE)
  app.use(
    compression({
      filter: (req, res) => {
        // Don't compress streaming responses
        if (req.url?.includes('/streaming/stream')) {
          return false;
        }
        // Use default compression filter
        return compression.filter(req, res);
      },
    }),
  );

  // CORS - Enable CORS (có thể config chi tiết hơn nếu cần)
  app.enableCors({
    origin: nodeEnv === 'production' ? process.env.FRONTEND_URL : true,
    credentials: true,
  });

  // Global prefix cho tất cả routes
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // Global Validation Pipe - Validate DTOs với class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ properties không có trong DTO
      forbidNonWhitelisted: true, // Throw error nếu có properties không được phép
      transform: true, // Tự động transform payloads thành DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Cho phép implicit type conversion
      },
    }),
  );

  // Global Exception Filters - Centralized error handling
  app.useGlobalFilters(new HttpExceptionFilter(), new ValidationFilter());

  // Global Interceptors - Transform responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger/OpenAPI Documentation
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Learn AI API')
      .setDescription('API documentation cho Learn AI project')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .addTag('api', 'API endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true, // Giữ authorization token sau khi refresh
      },
    });
  }

  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger documentation: http://localhost:${port}/${swaggerPath}`,
  );
  console.log(`🌍 Environment: ${nodeEnv}`);
}
void bootstrap();
