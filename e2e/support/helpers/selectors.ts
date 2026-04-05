// Centralized selectors for e2e tests
// Use data-testid attributes where possible for stability

export const selectors = {
  // Navigation
  nav: {
    home: '[data-testid="nav-home"]',
    explore: '[data-testid="nav-explore"]',
    profile: '[data-testid="nav-profile"]',
    login: '[data-testid="nav-login"]',
    logout: '[data-testid="nav-logout"]',
  },

  // Auth
  auth: {
    loginDialog: '[data-testid="login-dialog"]',
    googleButton: '[data-testid="google-signin"]',
    microsoftButton: '[data-testid="microsoft-signin"]',
  },

  // Circles
  circle: {
    list: '[data-testid="circle-list"]',
    card: '[data-testid="circle-card"]',
    name: '[data-testid="circle-name"]',
    createButton: '[data-testid="create-circle"]',
    createInput: '[data-testid="circle-name-input"]',
    submitCreate: '[data-testid="submit-circle"]',
  },

  // Questions
  question: {
    list: '[data-testid="question-list"]',
    card: '[data-testid="question-card"]',
    title: '[data-testid="question-title"]',
    body: '[data-testid="question-body"]',
    createButton: '[data-testid="create-question"]',
    titleInput: '[data-testid="question-title-input"]',
    bodyInput: '.ql-editor', // Quill editor
    submitCreate: '[data-testid="submit-question"]',
    editButton: '[data-testid="edit-question"]',
    deleteButton: '[data-testid="delete-question"]',
    upvoteButton: '[data-testid="upvote-question"]',
    downvoteButton: '[data-testid="downvote-question"]',
    voteCount: '[data-testid="question-vote-count"]',
  },

  // Answers
  answer: {
    list: '[data-testid="answer-list"]',
    card: '[data-testid="answer-card"]',
    text: '[data-testid="answer-text"]',
    createInput: '[data-testid="answer-input"]',
    submitCreate: '[data-testid="submit-answer"]',
    editButton: '[data-testid="edit-answer"]',
    deleteButton: '[data-testid="delete-answer"]',
    solutionButton: '[data-testid="mark-solution"]',
    solutionBadge: '[data-testid="solution-badge"]',
    replyButton: '[data-testid="reply-answer"]',
    upvoteButton: '[data-testid="upvote-answer"]',
    downvoteButton: '[data-testid="downvote-answer"]',
  },

  // Moderation
  moderation: {
    badge: '[data-testid="moderation-badge"]',
    blockButton: '[data-testid="block-content"]',
    approveButton: '[data-testid="approve-content"]',
    blockedIndicator: '[data-testid="blocked-indicator"]',
  },

  // Common
  common: {
    loading: '[data-testid="loading"]',
    error: '[data-testid="error"]',
    toast: '.p-toast', // PrimeNG toast
    confirmDialog: '.p-confirmdialog',
    confirmYes: '.p-confirmdialog-accept',
    confirmNo: '.p-confirmdialog-reject',
  },
};
