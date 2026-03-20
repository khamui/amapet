import Joi from 'joi';

export const aboutUpdateSchema = Joi.object({
  about: Joi.string().max(1000).allow('').required(),
});

export const moderatorAddSchema = Joi.object({
  username: Joi.string().required(),
});
