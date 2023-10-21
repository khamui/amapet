import { circleCreateSchema } from "./validators/validator.circles.js";

export const middlewareCircles = {
  hasRequired: (req, res, next) => {
    const { value, error } = circleCreateSchema.validate(req.body);

    if (error) {
      console.log(error);
      res
        .status(500)
        .send(error.message)
    } else {
      console.log(value);
      next()
    }
  }
}
