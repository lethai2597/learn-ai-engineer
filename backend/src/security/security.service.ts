import { Injectable, Logger } from '@nestjs/common';
import { PromptInjectionService } from './services/prompt-injection.service';
import { ContentModerationService } from './services/content-moderation.service';
import { PiiDetectionService } from './services/pii-detection.service';
import { RateLimitService } from './services/rate-limit.service';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(
    private readonly promptInjectionService: PromptInjectionService,
    private readonly contentModerationService: ContentModerationService,
    private readonly piiDetectionService: PiiDetectionService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  // production-security-01
  async detectInjection(text: string) {
    // [BUSINESS] Phát hiện prompt injection attacks
    // Prompt injection: User cố gắng override system instructions
    // Sử dụng LLM để phân tích và detect các pattern nguy hiểm
    return this.promptInjectionService.detectInjection(text);
  }

  // production-security-02
  moderateContent(text: string) {
    // [BUSINESS] Content moderation: Kiểm tra nội dung có vi phạm policy không
    // Sử dụng LLM để phân loại content: toxic, hate speech, violence, etc.
    return this.contentModerationService.moderateContent(text);
  }

  // production-security-03
  async detectPii(text: string) {
    // [BUSINESS] Phát hiện PII (Personally Identifiable Information)
    // PII: Email, SĐT, credit card, SSN, địa chỉ, etc.
    // Cần detect để bảo vệ privacy của user
    return this.piiDetectionService.detectPii(text);
  }

  // production-security-03
  async redactPii(text: string) {
    // [BUSINESS] Redact (xóa/mask) PII khỏi text
    // Thay thế PII bằng placeholder để bảo vệ privacy
    return this.piiDetectionService.redactPii(text);
  }

  async checkRateLimit(identifier: string, endpoint?: string) {
    const key = endpoint ? `${identifier}:${endpoint}` : identifier;
    return this.rateLimitService.checkRateLimit(key);
  }
}
