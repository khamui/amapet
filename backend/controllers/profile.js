import { Circle } from "../db/models/circle.js";
import { User } from "../db/models/user.js";
import { retrieveModelById, retrieveModel } from "../dbaccess.js";

export const getProfile = async (req, res, next) => {
  const id = req.userPayload._id;

  // get fields {
  //  first_name,
  //  last_name,
  //  email,
  //  respect,
  //  (followedCircles),
  //  (followedQuestions)
  //}
  const dbUser = await retrieveModelById(User, id);
  const userProfile = {
    firstName: dbUser.firstname,
    lastName: dbUser.lastname,
    email: dbUser.email,
    respect: dbUser.respect,
  };

  // query get extra fields { numOfCircles, numOfQuestions, level }
  const dbCircles = await retrieveModel(Circle, { ownerId: id });
  userProfile.numOfCircles = dbCircles.length;
  userProfile.numOfQuestions = dbCircles.reduce(
    (a, c) => a + c.questions.length,
    0,
  );

  return res.status(200).json({ profile: userProfile });
};
