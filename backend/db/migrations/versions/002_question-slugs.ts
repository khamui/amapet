import slugifyModule from 'slugify';
import { Circle } from '../../models/circle.js';

const slugify = slugifyModule as unknown as (
  str: string,
  options?: { lower?: boolean; strict?: boolean; trim?: boolean }
) => string;

export const version = '002';
export const name = 'question-slugs';

function generateSlug(title: string): string {
  const slug = slugify(title || '', {
    lower: true,
    strict: true,
    trim: true,
  }).slice(0, 100);

  return slug || 'untitled';
}

export async function up(): Promise<void> {
  const circles = await Circle.find({});
  let questionsUpdated = 0;

  for (const circle of circles) {
    const slugCounts = new Map<string, number>();
    let circleModified = false;

    for (const question of circle.questions) {
      if (!question.slug && question.title) {
        const baseSlug = generateSlug(question.title);
        const count = slugCounts.get(baseSlug) || 0;

        question.slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
        slugCounts.set(baseSlug, count + 1);

        questionsUpdated++;
        circleModified = true;
      }
    }

    if (circleModified) {
      await circle.save();
    }
  }

  console.log(`[Migration 002] Generated slugs for ${questionsUpdated} questions`);
}
