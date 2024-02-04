import mongoose from "mongoose";
import { Circle } from "../db/models/circle.js";
import { Answer } from "../db/models/answer.js";
import { Notification } from "../db/models/notification.js";
import { retrieveModel, generateModel } from "../dbaccess.js";

export const middlewareProfile = {
  //registerRespect: async (req, res, next) => {
  //  const { id: circleId, qid: questionId } = req.params;

  //  const filter = {
  //    _id: circleId,
  //    "questions._id": new mongoose.Types.ObjectId(questionId),
  //  };

  //  next();
  //},
};
