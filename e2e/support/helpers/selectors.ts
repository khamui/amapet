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
    myCirclesSection: '[data-testid="my-circles-section"]',
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
    unmarkSolutionButton: '[data-testid="unmark-solution"]',
    solutionBadge: '[data-testid="solution-badge"]',
    replyButton: '[data-testid="reply-answer"]',
    upvoteButton: '[data-testid="upvote-answer"]',
    downvoteButton: '[data-testid="downvote-answer"]',
  },

  // Editor
  editor: {
    submitButton: '[data-testid="submit-editor"]',
    cancelButton: '[data-testid="cancel-editor"]',
    quill: '.ql-editor',
  },

  // Question Detail
  questionDetail: {
    solutionPreview: '[data-testid="solution-preview"]',
    mainAnswerEditor: '[data-testid="main-answer-editor"]',
    commentsClosed: '[data-testid="comments-closed"]',
  },

  // Circle Management
  circleManagement: {
    followButton: '[data-testid="follow-circle"]',
    editDescription: '[data-testid="edit-circle-description"]',
    saveDescription: '[data-testid="save-circle-description"]',
    manageModerators: '[data-testid="manage-moderators"]',
    addModeratorInput: '[data-testid="add-moderator-input"]',
    removeModerator: '[data-testid="remove-moderator"]',
  },

  // Moderation
  moderation: {
    badge: '[data-testid="moderation-badge"]',
    blockButton: '[data-testid="block-content"]',
    approveButton: '[data-testid="approve-content"]',
    blockedIndicator: '[data-testid="blocked-indicator"]',
  },

  // Moderation Detail
  moderationDetail: {
    approveQuestion: '[data-testid="mod-approve-question"]',
    blockQuestion: '[data-testid="mod-block-question"]',
    closeComments: '[data-testid="mod-close-comments"]',
    noteInput: '[data-testid="mod-note-input"]',
    saveNote: '[data-testid="mod-save-note"]',
    approveAnswer: '[data-testid="mod-approve-answer"]',
    blockAnswer: '[data-testid="mod-block-answer"]',
  },

  // Notifications
  notifications: {
    bell: '[data-testid="notification-bell"]',
    item: '[data-testid="notification-item"]',
    badge: '[data-testid="notification-badge"]',
  },

  // Common
  common: {
    loading: '[data-testid="loading"]',
    error: '[data-testid="error"]',
    toast: '.p-toast', // PrimeNG toast
    // PrimeNG 20+ confirm dialog - use class and role for specificity
    confirmDialog: 'div.p-confirmdialog[role="alertdialog"]',
    confirmYes: 'div.p-confirmdialog button:has-text("Yes")',
    confirmNo: 'div.p-confirmdialog button:has-text("No")',
  },
};
