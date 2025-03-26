import jwt from 'jsonwebtoken';

export const middlewareAuth = {
  isAuthorized: (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
      } catch (error) {
        res.status(401).send(error);
      }
    } else {
      res.status(401).send('Not authorized, token missing.');
    }
  },
  getUserIdFromToken: (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userPayload = decoded;
        next();
      } catch (error) {
        res.status(401).send(error);
      }
    } else {
      res.status(401).send('Not authorized, token missing.');
    }
  }
}
