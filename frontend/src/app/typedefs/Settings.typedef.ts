export type Settings = {
  _id: String;
  key: 'question_intentions' | 'maintenance';
  inputType: 'multiopts' | 'binary';
  value: QuestionIntentionsValue[] | MaintenanceMode;
};

export type QuestionIntentionsValue = {
  id: 'question' | 'discussion' | 'advice' | 'information';
  label: String;
  active: Boolean;
};

export type MaintenanceMode = {
  isMaintenanceMode: boolean;
};
