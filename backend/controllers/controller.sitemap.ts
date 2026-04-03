import { Request, Response } from 'express';
import { Circle } from '../db/models/circle.js';

const SITE_URL = process.env.SITE_URL || 'https://www.helpa.ws';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

export const controllerSitemap = {
  getData: async (_req: Request, res: Response): Promise<void> => {
    try {
      const pipeline = [
        {
          $project: {
            name: 1,
            created_at: 1,
            questions: {
              $filter: {
                input: '$questions',
                cond: { $ne: ['$$this.moderationInfo.status', 'blocked'] },
              },
            },
          },
        },
      ];

      const circles = await Circle.aggregate(pipeline);
      const entries: SitemapEntry[] = [];

      for (const circle of circles) {
        const circleName = circle.name.replace(/^c\//, '');

        // Add circle entry
        entries.push({
          loc: `${SITE_URL}/c/${circleName}`,
          lastmod: formatDate(circle.created_at),
          changefreq: 'daily',
          priority: 0.8,
        });

        // Add question entries
        for (const question of circle.questions || []) {
          const slug = question.slug || question._id.toString();
          entries.push({
            loc: `${SITE_URL}/c/${circleName}/questions/${slug}`,
            lastmod: formatDate(question.modded_at || question.created_at),
            changefreq: 'weekly',
            priority: 0.7,
          });
        }
      }

      res.status(200).json(entries);
    } catch {
      res.status(500).send("couldn't generate sitemap data");
    }
  },
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toISOString().split('T')[0];
}
