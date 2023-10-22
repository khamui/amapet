import jwt from 'jsonwebtoken';

export const middlewareAuth = {
  isAuthorized: (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.status(500).send('Not authorized, token missing.');
    }
  }
}
