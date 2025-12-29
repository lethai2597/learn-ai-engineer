import { Injectable, Logger } from '@nestjs/common';

interface PiiPattern {
  type: string;
  pattern: RegExp;
  replacement: string;
}

@Injectable()
export class PiiDetectionService {
  private readonly logger = new Logger(PiiDetectionService.name);

  private readonly patterns: PiiPattern[] = [
    {
      type: 'EMAIL',
      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      replacement: '<EMAIL>',
    },
    {
      type: 'PHONE',
      pattern: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      replacement: '<PHONE>',
    },
    {
      type: 'SSN',
      pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
      replacement: '<SSN>',
    },
    {
      type: 'CREDIT_CARD',
      pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      replacement: '<CREDIT_CARD>',
    },
    {
      type: 'IP_ADDRESS',
      pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
      replacement: '<IP_ADDRESS>',
    },
  ];

  detectPii(text: string): {
    hasPii: boolean;
    detectedEntities: Array<{
      type: string;
      value: string;
      startIndex: number;
      endIndex: number;
    }>;
    details: string;
  } {
    const detectedEntities: Array<{
      type: string;
      value: string;
      startIndex: number;
      endIndex: number;
    }> = [];

    for (const patternItem of this.patterns) {
      const { pattern, type } = patternItem;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        detectedEntities.push({
          type,
          value: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }
    }

    const hasPii = detectedEntities.length > 0;
    const entityTypes = [...new Set(detectedEntities.map((e) => e.type))];

    let details = '';
    if (hasPii) {
      details = `Detected ${detectedEntities.length} PII entity(ies): ${entityTypes.join(', ')}`;
    } else {
      details = 'No PII detected';
    }

    return {
      hasPii,
      detectedEntities,
      details,
    };
  }

  redactPii(text: string): {
    redactedText: string;
    redactedCount: number;
    details: string;
  } {
    let redactedText = text;
    let redactedCount = 0;

    for (const patternItem of this.patterns) {
      const { pattern, replacement } = patternItem;
      const matches = text.matchAll(pattern);
      const matchArray = Array.from(matches);
      redactedCount += matchArray.length;

      redactedText = redactedText.replace(pattern, replacement);
    }

    const details = `Redacted ${redactedCount} PII entity(ies)`;

    return {
      redactedText,
      redactedCount,
      details,
    };
  }
}
