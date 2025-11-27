export type Settings = {
  _id: String;
  key: 'question_intentions';
  value: QuestionIntentionsValue[] | MaintenanceMode;
  bla: String;
};

export type QuestionIntentionsValue = {
  id: 'question' | 'discussion' | 'advice' | 'information';
  label: String;
};

export type MaintenanceMode = {
  isMaintenanceMode: boolean;
};
