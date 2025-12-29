import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMLog, LLMCallMetadata } from '../types/observability.types';

@Injectable()
export class CustomLoggerService implements OnModuleInit {
  private readonly logger = new Logger(CustomLoggerService.name);
  private enabled = false;
  private storage: 'memory' | 'database' = 'memory';
  private logs: LLMLog[] = [];
  private readonly MAX_MEMORY_LOGS = 1000;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.enabled = this.configService.get<boolean>(
      'observability.customLogging.enabled',
      true,
    );
    this.storage =
      (this.configService.get<'memory' | 'database'>(
        'observability.customLogging.storage',
      ) as 'memory' | 'database') || 'memory';

    if (this.enabled) {
      this.logger.log(`Custom logging enabled with ${this.storage} storage`);
    }
  }

  logLLMCall(log: LLMLog, metadata?: LLMCallMetadata): Promise<void> {
    if (!this.enabled) {
      return Promise.resolve();
    }

    const enrichedLog: LLMLog = {
      ...log,
      userId: metadata?.userId || log.userId,
      sessionId: metadata?.sessionId || log.sessionId,
      endpoint: metadata?.endpoint || log.endpoint,
      metadata: {
        ...log.metadata,
        ...metadata?.metadata,
        requestId: metadata?.requestId,
      },
    };

    if (this.storage === 'memory') {
      this.logs.push(enrichedLog);
      if (this.logs.length > this.MAX_MEMORY_LOGS) {
        this.logs.shift();
      }
      this.logger.debug(`Log saved. Total logs: ${this.logs.length}`);
    } else {
      this.logger.debug('Database storage not implemented yet');
    }

    this.logger.log(
      `LLM Call: ${log.model} | Tokens: ${log.tokens.total} | Cost: $${log.cost.toFixed(4)} | Latency: ${log.latency}ms`,
    );
    return Promise.resolve();
  }

  getLogs(filters?: {
    userId?: string;
    model?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<LLMLog[]> {
    if (!this.enabled || this.storage !== 'memory') {
      this.logger.debug(
        `getLogs: enabled=${this.enabled}, storage=${this.storage}`,
      );
      return Promise.resolve([]);
    }

    this.logger.debug(
      `getLogs: Total logs in memory: ${this.logs.length}, filters: ${JSON.stringify(filters)}`,
    );
    let filteredLogs = [...this.logs];

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(
        (log) => log.userId === filters.userId,
      );
    }

    if (filters?.model) {
      const filterModel = filters.model;
      filteredLogs = filteredLogs.filter((log) => {
        const logModelName = log.model.split('/').pop() || '';
        return (
          log.model === filterModel ||
          log.model.includes(filterModel) ||
          filterModel.includes(logModelName)
        );
      });
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) >= filters.startDate!,
      );
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) <= filters.endDate!,
      );
    }

    return Promise.resolve(filteredLogs.reverse());
  }

  getStats(): Promise<{
    totalCalls: number;
    totalCost: number;
    totalTokens: number;
    averageLatency: number;
    byModel: Record<string, { calls: number; cost: number }>;
  }> {
    if (!this.enabled || this.storage !== 'memory') {
      return Promise.resolve({
        totalCalls: 0,
        totalCost: 0,
        totalTokens: 0,
        averageLatency: 0,
        byModel: {},
      });
    }

    const totalCalls = this.logs.length;
    const totalCost = this.logs.reduce((sum, log) => sum + log.cost, 0);
    const totalTokens = this.logs.reduce(
      (sum, log) => sum + log.tokens.total,
      0,
    );
    const averageLatency =
      this.logs.reduce((sum, log) => sum + log.latency, 0) / totalCalls || 0;

    const byModel: Record<string, { calls: number; cost: number }> = {};
    this.logs.forEach((log) => {
      if (!byModel[log.model]) {
        byModel[log.model] = { calls: 0, cost: 0 };
      }
      byModel[log.model].calls += 1;
      byModel[log.model].cost += log.cost;
    });

    return Promise.resolve({
      totalCalls,
      totalCost,
      totalTokens,
      averageLatency,
      byModel,
    });
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
