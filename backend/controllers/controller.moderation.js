import { User } from "../db/models/user.js";
import { retrieveModelById } from "../dbaccess.js";

export const controllerModeration = {
  getModeratedCircleIds: async (req, res, next) => {
    try {
      const id = req.userPayload._id;
      const dbUser = await retrieveModelById(User, id);
      const { moderatedCircles } = dbUser;

      return res.status(200).json({ moderatedCircles });
    } catch (error) {
      console.error("Error retrieving profile:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  //followCircle: async (req, res, next) => {
  //  const { circleName } = req.body;
  //  const userId = req.userPayload._id;

  //  try {
  //    const user = await retrieveModelById(User, userId);
  //    if (!user.followedCircles.includes(circleName)) {
  //      // follow the circle
  //      user.followedCircles.push(circleName);
  //      await user.save();
  //      return res.status(200).json({
  //        message: "Circle followed successfully",
  //        action: "followed",
  //      });
  //    } else {
  //      // unfollow the circle
  //      user.followedCircles = user.followedCircles.filter(
  //        (circle) => circle !== circleName,
  //      );
  //      await user.save();
  //      return res
  //        .status(200)
  //        .json({
  //          message: "Circle unfollowed successfully",
  //          action: "unfollowed",
  //        });
  //    }
  //  } catch (error) {
  //    console.error("Error following circle:", error);
  //    return res.status(500).json({ error: "Internal server error" });
  //  }
  //},
};
