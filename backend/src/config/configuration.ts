/**
 * Configuration schema và validation
 * Sử dụng với @nestjs/config để validate environment variables
 */
export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  api: {
    prefix: process.env.API_PREFIX || 'api',
    version: process.env.API_VERSION || 'v1',
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== 'false',
    path: process.env.SWAGGER_PATH || 'api-docs',
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    defaultModel: 'openai/gpt-4o',
    temperature: 0.7,
    maxTokens: 2000,
  },
  chroma: {
    apiKey: process.env.CHROMA_API_KEY || '',
    tenant: process.env.CHROMA_TENANT || '',
    database: process.env.CHROMA_DATABASE || '',
    collectionName: process.env.CHROMA_COLLECTION_NAME || 'documents',
  },
  observability: {
    langsmith: {
      enabled: process.env.LANGSMITH_ENABLED === 'true',
      apiKey: process.env.LANGCHAIN_API_KEY || '',
      project: process.env.LANGCHAIN_PROJECT || 'learn-ai',
    },
    helicone: {
      enabled: process.env.HELICONE_ENABLED === 'true',
      apiKey: process.env.HELICONE_API_KEY || '',
    },
    customLogging: {
      enabled: process.env.CUSTOM_LOGGING_ENABLED !== 'false',
      storage: (process.env.CUSTOM_LOGGING_STORAGE || 'memory') as
        | 'memory'
        | 'database',
    },
  },
});
