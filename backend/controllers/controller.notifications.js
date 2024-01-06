import {
  retrieveModel,
  updateModel,
} from "../dbaccess.js";
import { Notification } from "../db/models/notification.js";

export const controllerNotifications = {
  readAll: async (req, res) => {
    const { _id: userId } = req.userPayload;
    try {
      const userNotifications = await retrieveModel(Notification, { userId });
      res.status(200).json(userNotifications.reverse());
    } catch (error) {
      res.status(500).send(error);
    }
  },
  markAsRead: async (req, res) => {
    const { id: notificationId } = req.params;
    const filter = { _id: notificationId };
    const updateExpr = { unread: false };

    try {
      const updated = await updateModel(Notification, filter, updateExpr);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};
