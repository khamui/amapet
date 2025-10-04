import { User } from "../db/models/user.js";
import { Circle } from "../db/models/circle.js";
import { retrieveModelById } from "../dbaccess.js";

export const controllerModeration = {
  getModeratedCircleIds: async (req, res, next) => {
    try {
      const id = req.userPayload._id;
      const dbUser = await retrieveModelById(User, id);
      const { moderatedCircleIds } = dbUser;

      return res.status(200).json({ moderatedCircleIds });
    } catch (error) {
      console.error("Error retrieving profile:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getModeratedCircles: async (req, res, next) => {
    try {
      // get users' moderated circles
      const id = req.userPayload._id;
      const dbUser = await retrieveModelById(User, id);
      const { moderatedCircleIds } = dbUser;
      const moderatedCircles = [];

      // get circle details from moderatedCirclesIds
      for (const circleId of moderatedCircleIds) {
        const foundCircle = await retrieveModelById(Circle, circleId);
        if (foundCircle) {
          moderatedCircles.push(foundCircle);
        }
      }
      res.status(200).json({ moderatedCircles });

    } catch (error) {
      res.status(500).send("couldn't retrieve model");
    }
  },
};
