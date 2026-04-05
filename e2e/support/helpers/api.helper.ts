import type { APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3000';

export interface TestUser {
  token: string;
  user: {
    _id: string;
    email: string;
    username: string;
    permLevel: number;
  };
}

export interface TestCircle {
  _id: string;
  name: string;
  ownerId: string;
}

export interface TestQuestion {
  _id: string;
  slug: string;
  title: string;
  circleId: string;
}

export interface TestAnswer {
  _id: string;
  answerText: string;
  questionId: string;
}

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  async createTestUser(options?: {
    email?: string;
    username?: string;
    permLevel?: number;
  }): Promise<TestUser> {
    const response = await this.request.post(`${API_URL}/test-auth`, {
      data: options || {},
    });
    if (!response.ok()) {
      throw new Error(`Failed to create test user: ${response.status()}`);
    }
    return response.json();
  }

  async createCircle(token: string, name: string, ownerId: string): Promise<TestCircle> {
    const response = await this.request.post(`${API_URL}/circles`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name, ownerId, questions: [] },
    });
    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to create circle: ${response.status()} - ${text}`);
    }
    return response.json();
  }

  async createQuestion(
    token: string,
    circleId: string,
    data: { title: string; body: string; ownerId: string; ownerName: string }
  ): Promise<TestQuestion> {
    const response = await this.request.post(
      `${API_URL}/circles/${circleId}/questions/create`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          ...data,
          circleId,
          intentionId: 'question', // Default intention
        },
      }
    );
    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to create question: ${response.status()} - ${text}`);
    }
    return response.json();
  }

  async createAnswer(
    token: string,
    data: {
      parentId: string;
      parentType: 'question' | 'answer';
      answerText: string;
      questionId: string;
      circleId: string;
    }
  ): Promise<TestAnswer> {
    const response = await this.request.post(`${API_URL}/answers/create`, {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
    if (!response.ok()) {
      throw new Error(`Failed to create answer: ${response.status()}`);
    }
    return response.json();
  }

  async cleanup(collections: string[]): Promise<void> {
    const response = await this.request.post(`${API_URL}/test-cleanup`, {
      data: { collections },
    });
    if (!response.ok()) {
      throw new Error(`Failed to cleanup: ${response.status()}`);
    }
  }
}
