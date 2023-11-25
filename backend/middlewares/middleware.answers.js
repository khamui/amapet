import {
  answerCreateSchema,
  answerEditSchema,
} from "./validators/validator.answers.js";

export const middlewareAnswers = {
  answerCreateCheck: (req, res, next) => {
    const { error } = answerCreateSchema.validate(req.body);

    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      next();
    }
  },
  answerEditCheck: (req, res, next) => {
    const { error } = answerEditSchema.validate(req.body);

    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      next();
    }
  },
};
