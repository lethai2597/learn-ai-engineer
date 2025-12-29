import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ModerationCategory {
  name: string;
  keywords: string[];
  severity: number;
}

@Injectable()
export class ContentModerationService {
  private readonly logger = new Logger(ContentModerationService.name);

  private readonly categories: ModerationCategory[] = [
    {
      name: 'hate',
      keywords: ['hate', 'kill', 'destroy', 'violence'],
      severity: 0.8,
    },
    {
      name: 'harassment',
      keywords: ['harass', 'bully', 'threaten'],
      severity: 0.7,
    },
    {
      name: 'self-harm',
      keywords: ['suicide', 'self-harm', 'hurt myself'],
      severity: 0.9,
    },
    {
      name: 'sexual',
      keywords: ['sexual', 'explicit', 'porn'],
      severity: 0.8,
    },
    {
      name: 'violence',
      keywords: ['violence', 'weapon', 'attack', 'bomb'],
      severity: 0.9,
    },
  ];

  constructor(private readonly configService: ConfigService) {}

  moderateContent(text: string): Promise<{
    flagged: boolean;
    categories: Record<string, boolean>;
    categoryScores: Record<string, number>;
    details: string;
  }> {
    const categories: Record<string, boolean> = {};
    const categoryScores: Record<string, number> = {};

    for (const category of this.categories) {
      let score = 0;
      let matchCount = 0;

      for (const keyword of category.keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          matchCount += matches.length;
          score += category.severity * 0.2;
        }
      }

      const finalScore = Math.min(1.0, score + matchCount * 0.1);
      categoryScores[category.name] = finalScore;
      categories[category.name] = finalScore > 0.5;
    }

    const flagged = Object.values(categories).some((v) => v === true);
    const flaggedCategories = Object.entries(categories)
      .filter(([, v]) => v)
      .map(([k]) => k);

    let details = '';
    if (flagged) {
      details = `Content flagged for: ${flaggedCategories.join(', ')}`;
    } else {
      details = 'Content is safe';
    }

    return Promise.resolve({
      flagged,
      categories,
      categoryScores,
      details,
    });
  }
}
