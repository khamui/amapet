import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { User } from '../db/models/user.js';
import { Circle } from '../db/models/circle.js';
import { Answer } from '../db/models/answer.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function migrateOwnerNames() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Build user lookup map: userId -> username
  const users = await User.find({});
  const userMap = new Map<string, string>();
  for (const user of users) {
    if (user._id && user.username) {
      userMap.set(user._id.toString(), user.username);
    }
  }
  console.log(`Loaded ${userMap.size} users`);

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
  console.log(`Updated ${answersUpdated} answers`);

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
  console.log(`Updated ${questionsUpdated} questions`);

  await mongoose.disconnect();
  console.log('Migration complete');
}

migrateOwnerNames().catch(console.error);
