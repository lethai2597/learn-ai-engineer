import { Injectable, Logger } from '@nestjs/common';

interface InjectionPattern {
  pattern: RegExp;
  name: string;
  severity: 'high' | 'medium' | 'low';
}

@Injectable()
export class PromptInjectionService {
  private readonly logger = new Logger(PromptInjectionService.name);

  private readonly patterns: InjectionPattern[] = [
    {
      pattern: /ignore\s+(previous|all)\s+instructions?/i,
      name: 'Ignore Instructions',
      severity: 'high',
    },
    {
      pattern: /system\s*:?\s*you\s+are/i,
      name: 'System Role Injection',
      severity: 'high',
    },
    {
      pattern: /\[SYSTEM\]/i,
      name: 'System Tag Injection',
      severity: 'high',
    },
    {
      pattern: /new\s+role/i,
      name: 'Role Change Attempt',
      severity: 'medium',
    },
    {
      pattern: /forget\s+everything/i,
      name: 'Forget Instructions',
      severity: 'medium',
    },
    {
      pattern: /you\s+are\s+now/i,
      name: 'Role Reassignment',
      severity: 'medium',
    },
    {
      pattern: /override\s+previous/i,
      name: 'Override Attempt',
      severity: 'medium',
    },
    {
      pattern: /disregard\s+(previous|all)/i,
      name: 'Disregard Instructions',
      severity: 'high',
    },
    {
      pattern: /<\|(system|admin)\|>/i,
      name: 'Special Tag Injection',
      severity: 'high',
    },
    {
      pattern: /jailbreak/i,
      name: 'Jailbreak Mention',
      severity: 'low',
    },
  ];

  detectInjection(text: string): {
    isInjection: boolean;
    confidence: number;
    matchedPatterns: string[];
    details: string;
  } {
    const matchedPatterns: string[] = [];
    let totalSeverity = 0;

    for (const { pattern, name, severity } of this.patterns) {
      if (pattern.test(text)) {
        matchedPatterns.push(name);
        totalSeverity +=
          severity === 'high' ? 3 : severity === 'medium' ? 2 : 1;
      }
    }

    const isInjection = matchedPatterns.length > 0;
    const confidence = Math.min(
      1.0,
      totalSeverity / (this.patterns.length * 3),
    );

    let details = '';
    if (isInjection) {
      details = `Detected ${matchedPatterns.length} suspicious pattern(s): ${matchedPatterns.join(', ')}`;
    } else {
      details = 'No prompt injection patterns detected';
    }

    return {
      isInjection,
      confidence,
      matchedPatterns,
      details,
    };
  }
}
