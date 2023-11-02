import Joi from "joi";

export const circleCreateSchema = Joi.object({
  ownerId: Joi.string()
    .required(), 
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
})

export const questionCreateSchema = Joi.object({
  circleId: Joi.string()
    .required(), 
  ownerId: Joi.string()
    .required(), 
  ownerName: Joi.string()
    .required(), 
  title: Joi.string()
    .min(3)
    .max(150)
    .required(),
  body: Joi.string()
    .max(3000)
    .required(),
  upvotes: Joi.number()
    .integer()
    .required(),
  downvotes: Joi.number()
    .integer()
    .required()
})
