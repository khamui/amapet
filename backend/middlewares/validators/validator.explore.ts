import Joi from 'joi';

export const explorePaginationSchema = Joi.object({
  skip: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(30),
});
