import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../db/models/user.js";
import { generateModel, retrieveOneModelByQuery } from "../dbaccess.js";
import * as dotenv from "dotenv";

const EXP_IN_S = 604800; // 7 days expiration time
// const EXP_IN_S = 15; // 15 s expiration time
const { GOOGLE_CLIENT_ID } = process.env;
const client = new OAuth2Client();

export const signin = (req, res, next) => {
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: GOOGLE_CLIENT_ID,
    });
    const originalPayload = getPayload(ticket);
    const userPayload = await getUserOrCreateUser(originalPayload);

    let token = jwt.sign(userPayload.toJSON(), process.env.JWT_SECRET, {
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
  console.log('getUserOrCreateUser result:', result);
  if (!result) {
    const newUser = {
      ...originalPayload,
      followedCircles: [],
      followedQuestions: [],
      moderatedCircleIds: [],
      respectPoints: 0
    }
    result = await generateModel(User, newUser);
  }
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
