import slugifyModule from 'slugify';
import { Circle } from '../db/models/circle.js';

const slugify = slugifyModule as unknown as (
  str: string,
  options?: { lower?: boolean; strict?: boolean; trim?: boolean }
) => string;

export const generateSlug = (title: string): string => {
  const slug = slugify(title || '', {
    lower: true,
    strict: true,
    trim: true,
  }).slice(0, 100);

  return slug || 'untitled';
};

export const generateUniqueSlug = async (
  circleId: string,
  title: string,
  excludeQuestionId?: string
): Promise<string> => {
  const baseSlug = generateSlug(title);
  const circle = await Circle.findById(circleId);

  if (!circle) {
    throw new Error('Circle not found');
  }

  const existingSlugs = new Set(
    circle.questions
      .filter((q) => q._id?.toString() !== excludeQuestionId)
      .map((q) => q.slug)
      .filter(Boolean)
  );

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter++;
  }
  return `${baseSlug}-${counter}`;
};
