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
    data: { title: string; body: string; ownerId: string; ownerName: string; images?: string[] }
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
      ownerId: string;
      ownerName: string;
    }
  ): Promise<TestAnswer> {
    const response = await this.request.post(`${API_URL}/answers/create`, {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to create answer: ${response.status()} - ${text}`);
    }
    return response.json();
  }

  async cleanup(options: {
    collections: string[];
    afterTimestamp?: number;
    emailPattern?: string;
  }): Promise<{ success: boolean; deleted?: Record<string, number> }> {
    const response = await this.request.post(`${API_URL}/test-cleanup`, {
      data: options,
    });
    if (!response.ok()) {
      throw new Error(`Failed to cleanup: ${response.status()}`);
    }
    return response.json();
  }

  async markSolution(
    token: string,
    circleId: string,
    questionId: string,
    answerId: string | null
  ): Promise<TestQuestion> {
    const response = await this.request.put(
      `${API_URL}/circles/${circleId}/questions/${questionId}/solution`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { answerId },
      }
    );
    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to mark solution: ${response.status()} - ${text}`);
    }
    return response.json();
  }

  async followCircle(token: string, circleName: string): Promise<{ result: { action: string } }> {
    const response = await this.request.post(`${API_URL}/follow-circle`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { circleName },
    });
    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to follow circle: ${response.status()} - ${text}`);
    }
    return response.json();
  }

  async closeQuestion(
    token: string,
    circleId: string,
    questionId: string,
    closed: boolean
  ): Promise<TestQuestion> {
    const response = await this.request.put(
      `${API_URL}/moderation/circles/${circleId}/questions/${questionId}/close`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { closed },
      }
    );
    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to close question: ${response.status()} - ${text}`);
    }
    return response.json();
  }

  async addModeratorNote(
    token: string,
    circleId: string,
    questionId: string,
    noteText: string
  ): Promise<TestQuestion> {
    const response = await this.request.put(
      `${API_URL}/moderation/circles/${circleId}/questions/${questionId}/note`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { noteText },
      }
    );
    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to add note: ${response.status()} - ${text}`);
    }
    return response.json();
  }

  async updateAnswerStatus(
    token: string,
    answerId: string,
    status: 'unread' | 'approved' | 'blocked'
  ): Promise<TestAnswer> {
    const response = await this.request.put(
      `${API_URL}/moderation/answers/${answerId}/status`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { status },
      }
    );
    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to update answer status: ${response.status()} - ${text}`);
    }
    return response.json();
  }
}

// Standalone helper for use in global teardown (without Playwright request context)
export const apiHelper = {
  async cleanup(options: {
    collections: string[];
    afterTimestamp?: number;
    emailPattern?: string;
  }): Promise<{ success: boolean; deleted?: Record<string, number> }> {
    const response = await fetch(`${API_URL}/test-cleanup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    if (!response.ok) {
      throw new Error(`Failed to cleanup: ${response.status}`);
    }
    return response.json();
  },
};
