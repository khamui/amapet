import {
  retrieveModel,
} from "../dbaccess.js";
import { Notification } from "../db/models/notification.js";

export const controllerNotifications = {
  readAll: async (req, res) => {
    const { _id: userId } = req.userPayload;
    try {
      const userNotifications = await retrieveModel(Notification, { userId });
      res.status(200).json(userNotifications);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
