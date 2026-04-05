import Joi from 'joi';

export const circleCreateSchema = Joi.object({
  ownerId: Joi.string().required(),
  name: Joi.string().min(3).max(30).required(),
  questions: Joi.array().default([]).required(),
});

export const questionCreateSchema = Joi.object({
  circleId: Joi.string().required(),
  ownerId: Joi.string().required(),
  ownerName: Joi.string().required(),
  title: Joi.string().min(3).max(150).required(),
  body: Joi.string().max(3000).allow('').optional(),
  intentionId: Joi.string().required(),
});

export const questionEditSchema = Joi.object({
  title: Joi.string().min(3).max(150).required(),
  body: Joi.string().max(3000).required(),
});

export const questionSolutionSchema = Joi.object({
  answerId: Joi.string().allow(null).required(),
});

export const questionsPaginationSchema = Joi.object({
  skip: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(50),
}).unknown(true);
