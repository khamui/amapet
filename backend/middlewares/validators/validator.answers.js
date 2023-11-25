import Joi from "joi";

export const answerCreateSchema = Joi.object({
  parentId: Joi.string()
    .required(),
  parentType: Joi.string()
    .valid("question", "answer")
    .required(),
  ownerId: Joi.string()
    .required(), 
  ownerName: Joi.string()
    .required(), 
  answerText: Joi.string()
    .required()
})

export const answerEditSchema = Joi.object({
  answertext: Joi.string()
    .required(),
})
