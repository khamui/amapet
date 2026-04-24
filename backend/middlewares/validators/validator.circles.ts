import Joi from 'joi';
import { QUESTION_BODY_MAX_LENGTH, QUESTION_TITLE_MAX_LENGTH } from '../../constants/question.constants.js';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#\d+;/g, ' ');
}

const bodySchema = Joi.string().custom((value, helpers) => {
  const textLength = stripHtml(value).trim().length;
  if (textLength > QUESTION_BODY_MAX_LENGTH) {
    return helpers.error('string.max', { limit: QUESTION_BODY_MAX_LENGTH });
  }
  return value;
});

export const circleCreateSchema = Joi.object({
  ownerId: Joi.string().required(),
  name: Joi.string().min(3).max(30).required(),
  questions: Joi.array().default([]).required(),
});

export const questionCreateSchema = Joi.object({
  circleId: Joi.string().required(),
  ownerId: Joi.string().required(),
  ownerName: Joi.string().required(),
  title: Joi.string().min(3).max(QUESTION_TITLE_MAX_LENGTH).required(),
  body: bodySchema.allow('').optional(),
  images: Joi.array().items(Joi.string().uri()).max(5).default([]),
  intentionId: Joi.string().required(),
});

export const questionEditSchema = Joi.object({
  title: Joi.string().min(3).max(QUESTION_TITLE_MAX_LENGTH).required(),
  body: bodySchema.required(),
  images: Joi.array().items(Joi.string().uri()).max(5).required(),
});

export const questionSolutionSchema = Joi.object({
  answerId: Joi.string().allow(null).required(),
});

export const questionsPaginationSchema = Joi.object({
  skip: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(50),
}).unknown(true);
