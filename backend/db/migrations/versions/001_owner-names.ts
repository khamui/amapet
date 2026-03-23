import { User } from '../../models/user.js';
import { Circle } from '../../models/circle.js';
import { Answer } from '../../models/answer.js';

export const version = '001';
export const name = 'owner-names';

export async function up(): Promise<void> {
  // Build user lookup map: userId -> username
  const users = await User.find({});
  const userMap = new Map<string, string>();
  for (const user of users) {
    if (user._id && user.username) {
      userMap.set(user._id.toString(), user.username);
    }
  }
  console.log(`[Migration 001] Loaded ${userMap.size} users`);

  // 1. Update all answers
  const answers = await Answer.find({});
  let answersUpdated = 0;
  for (const answer of answers) {
    if (answer.ownerId) {
      const username = userMap.get(answer.ownerId);
      if (username && answer.ownerName !== username) {
        answer.ownerName = username;
        await answer.save();
        answersUpdated++;
      }
    }
  }
  console.log(`[Migration 001] Updated ${answersUpdated} answers`);

  // 2. Update all questions (embedded in circles)
  const circles = await Circle.find({});
  let questionsUpdated = 0;
  for (const circle of circles) {
    let circleModified = false;
    for (const question of circle.questions) {
      if (question.ownerId) {
        const username = userMap.get(question.ownerId);
        if (username && question.ownerName !== username) {
          question.ownerName = username;
          questionsUpdated++;
          circleModified = true;
        }
      }
    }
    if (circleModified) {
      await circle.save();
    }
  }
  console.log(`[Migration 001] Updated ${questionsUpdated} questions`);
}
