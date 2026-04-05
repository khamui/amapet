import { test as base, expect } from '@playwright/test';
import { ApiHelper, TestUser, TestCircle, TestQuestion, TestAnswer } from '../support/helpers/api.helper';

// Extend base test with fixtures
export const test = base.extend<{
  api: ApiHelper;
  testUser: TestUser;
  testCircle: TestCircle;
  testQuestion: TestQuestion;
  testAnswer: TestAnswer;
}>({
  api: async ({ request }, use) => {
    const api = new ApiHelper(request);
    await use(api);
  },

  testUser: async ({ api }, use) => {
    const user = await api.createTestUser({
      email: `test-${Date.now()}@e2e.test`,
    });
    await use(user);
  },

  testCircle: async ({ api, testUser }, use) => {
    const circleName = `test-circle-${Date.now()}`;
    const circle = await api.createCircle(testUser.token, circleName, testUser.user._id);
    await use(circle);
  },

  testQuestion: async ({ api, testUser, testCircle }, use) => {
    const question = await api.createQuestion(testUser.token, testCircle._id, {
      title: `Test Question ${Date.now()}`,
      body: '<p>This is a test question body</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });
    await use(question);
  },

  testAnswer: async ({ api, testUser, testCircle, testQuestion }, use) => {
    const answer = await api.createAnswer(testUser.token, {
      parentId: testQuestion._id,
      parentType: 'question',
      answerText: '<p>This is a test answer</p>',
      questionId: testQuestion._id,
      circleId: testCircle._id,
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });
    await use(answer);
  },
});

export { expect };
