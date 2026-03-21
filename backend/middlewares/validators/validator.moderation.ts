import Joi from 'joi';

export const moderationStatusSchema = Joi.object({
  status: Joi.string().valid('unread', 'approved', 'blocked').required(),
});

export const moderationCloseSchema = Joi.object({
  closed: Joi.boolean().required(),
});

export const moderationNoteSchema = Joi.object({
  noteText: Joi.string().max(500).allow('').required(),
});
