import { Circle } from "../db/models/circle.js";
import { User } from "../db/models/user.js";
import { retrieveModelById, retrieveModel } from "../dbaccess.js";

export const controllerProfile = {
  getProfile: async (req, res, next) => {
    try {
      const id = req.userPayload._id;
      const dbUser = await retrieveModelById(User, id);
      const userProfile = {
        firstName: dbUser.firstname,
        lastName: dbUser.lastname,
        email: dbUser.email,
        followedCircles: dbUser.followedCircles,
        followedQuestions: dbUser.followedQuestions,
        respectPoints: dbUser.respectPoints,
      };

      // query get extra fields { numOfCircles, numOfQuestions, level }
      const dbCircles = await retrieveModel(Circle, { ownerId: id });
      userProfile.numOfCircles = dbCircles.length;
      userProfile.numOfQuestions = dbCircles.reduce(
        (a, c) => a + c.questions.length,
        0,
      );

      return res.status(200).json({ profile: userProfile });
    } catch (error) {
      console.error("Error retrieving profile:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  followCircle: async (req, res, next) => {
    const { circleName } = req.body;
    const userId = req.userPayload._id;

    try {
      const user = await retrieveModelById(User, userId);
      if (!user.followedCircles.includes(circleName)) {
        // follow the circle
        user.followedCircles.push(circleName);
        await user.save();
        return res.status(200).json({
          message: "Circle followed successfully",
          action: "followed",
        });
      } else {
        // unfollow the circle
        user.followedCircles = user.followedCircles.filter(
          (circle) => circle !== circleName,
        );
        await user.save();
        return res
          .status(200)
          .json({
            message: "Circle unfollowed successfully",
            action: "unfollowed",
          });
      }
    } catch (error) {
      console.error("Error following circle:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
