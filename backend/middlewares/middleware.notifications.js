import mongoose from "mongoose";
import { Circle } from "../db/models/circle.js";
import { Answer } from "../db/models/answer.js";
import { Notification } from "../db/models/notification.js";
import { retrieveModel, generateModel } from "../dbaccess.js";

const NOTIFY_THRESH_LOW = 0;
const NOTIFY_THRESH_MID = 10;
const NOTIFY_THRESH_HIGH = 20;

export const middlewareNotifications = {
  registerQuestionUpvote: async (req, res, next) => {
    const { id: circleId, qid: questionId } = req.params;

    const filter = {
      _id: circleId,
      "questions._id": new mongoose.Types.ObjectId(questionId),
    };

    const foundCircle = await retrieveModel(Circle, filter);
    const foundQuestion = foundCircle[0].questions.find(
      (q) => q._id.toString() === questionId,
    );
    const { upvotes, downvotes } = foundQuestion;
    const totalVotes = upvotes.length - downvotes.length + 1;

    if (typeof totalVotes === "number") {
      const payload = {
        userId: foundQuestion.ownerId,
        type: "upvote",
        unread: true,
        originCircleId: circleId,
        originCircleName: foundCircle[0].name,
        originQuestionId: questionId,
        created_at: Date.now(),
      };

      if (totalVotes >= NOTIFY_THRESH_LOW) {
        payload.value = 5;
        await generateModel(Notification, payload);
        // write to notifications db
      } else if (totalVotes >= NOTIFY_THRESH_MID) {
        payload.value = 10;
        await generateModel(Notification, payload);
      } else if (totalVotes >= NOTIFY_THRESH_HIGH) {
        payload.value = 15;
        await generateModel(Notification, payload);
      }
    }
    next();
  },
  registerAnswerUpvote: async (req, res, next) => {
    const { circleId, questionId } = req.body;
    const { id } = req.params;

    const circleFilter = { _id: circleId };
    const answerFilter = { _id: id };

    const foundCircle = await retrieveModel(Circle, circleFilter);
    const foundAnswer = await retrieveModel(Answer, answerFilter);
    const { upvotes, downvotes } = foundAnswer[0];
    const totalVotes = upvotes.length - downvotes.length + 1;

    if (typeof totalVotes === "number") {
      const payload = {
        userId: foundAnswer[0].ownerId,
        type: "upvote",
        unread: true,
        originCircleId: circleId,
        originCircleName: foundCircle[0].name,
        originQuestionId: questionId,
        created_at: Date.now(),
      };

      if (totalVotes >= NOTIFY_THRESH_LOW) {
        payload.value = 5;
        await generateModel(Notification, payload);
      } else if (totalVotes >= NOTIFY_THRESH_MID) {
        payload.value = 10;
        await generateModel(Notification, payload);
      } else if (totalVotes >= NOTIFY_THRESH_HIGH) {
        payload.value = 15;
        await generateModel(Notification, payload);
      }
    }
    next();
  },
  registerComment: async (req, res, next) => {
    const circleId = req.body.circleId;
    const questionId = req.body.questionId;
    const { parentId, parentType, answerText } = req.body;

    const filter = { _id: circleId };
    const foundCircle = await retrieveModel(Circle, filter);

    let foundParent;
    if (parentType === 'question') {
      foundParent = foundCircle[0].questions.find(
        (q) => q._id.toString() === questionId,
      );
    } else {
      const filter = { _id: parentId };
      const foundAnswer = await retrieveModel(Answer, filter);
      foundParent = foundAnswer[0];
    }

    const payload = {
      userId: foundParent.ownerId,
      type: "comment",
      unread: true,
      value: answerText,
      originCircleId: circleId,
      originCircleName: foundCircle[0].name,
      originQuestionId: questionId,
      created_at: Date.now(),
    };

    await generateModel(Notification, payload);
    next();
  }
};
