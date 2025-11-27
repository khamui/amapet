import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../db/models/user.js";
import { generateModel, retrieveOneModelByQuery } from "../dbaccess.js";
import { GOOGLE_CLIENT_ID, GOOGLE_JWT_SECRET } from "../server.js";

const EXP_IN_S = 604800; // 7 days expiration time
// const EXP_IN_S = 15; // 15 s expiration time
const client = new OAuth2Client();
export const signin = (req, res, next) => {
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: GOOGLE_CLIENT_ID,
    });
    const originalPayload = getPayload(ticket);
    const userPayload = await getUserOrCreateUser(originalPayload);

    let token = jwt.sign(userPayload.toJSON(), GOOGLE_JWT_SECRET, {
      expiresIn: EXP_IN_S,
    });
    return token;
  }

  verify()
    .then((token) => res.status(200).json({ token }))
    .catch(console.error);
};

const getUserOrCreateUser = async (originalPayload) => {
  let result = await retrieveOneModelByQuery(User, {
    email: originalPayload.email,
  });
  if (!result) {
    const newUser = {
      ...originalPayload,
      followedCircles: [],
      followedQuestions: [],
      respectPoints: 0
    }
    result = await generateModel(User, newUser);
  }
  console.log('result', result);
  return result;
};

const getPayload = (ticket) => {
  const payload = ticket.getPayload();
  return {
    email: payload["email"],
    firstname: payload["given_name"],
    lastname: payload["family_name"],
  };
};
