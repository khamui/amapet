import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const EXP_IN_S = 604800; // 7 days expiration time
const GOOGLE_CLIENT_ID =
  "265914185201-bgvd5l7u0bqijnknsqqo17kg51thnmpi.apps.googleusercontent.com";
const client = new OAuth2Client();

export const signin = (req, res, next) => {
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const encodedPayload = {
      email: payload["email"],
      firstname: payload["given_name"],
      lastname: payload["family_name"],
    };
    let token = jwt.sign(encodedPayload, process.env.JWT_SECRET, {
      expiresIn: EXP_IN_S,
    });
    res.status(200).json({ token });
  }

  verify().catch(console.error);
};
