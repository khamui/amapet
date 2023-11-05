import { circleCreateSchema } from "./validators/validator.circles.js";
import { questionCreateSchema } from "./validators/validator.circles.js";
import { questionEditSchema } from "./validators/validator.circles.js";

export const middlewareCircles = {
  circleCreateCheck: (req, res, next) => {
    const { error } = circleCreateSchema.validate(req.body);

    if (error) {
      console.log(error);
      res
        .status(500)
        .send(error.message)
    } else {
      next()
    }
  },
  questionCreateCheck: (req, res, next) => {
    const { error } = questionCreateSchema.validate(req.body);

    if (error) {
      console.log(error);
      res
        .status(500)
        .send(error.message)
    } else {
      next()
    }
  },
  questionEditCheck: (req, res, next) => {
    const { error } = questionEditSchema.validate(req.body);

    if (error) {
      console.log(error);
      res
        .status(500)
        .send(error.message)
    } else {
      next()
    }
  }
}
