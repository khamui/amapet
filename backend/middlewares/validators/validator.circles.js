import Joi from "joi";

export const circleCreateSchema = Joi.object({
  ownerId: Joi.string()
    .required(), 
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
})
