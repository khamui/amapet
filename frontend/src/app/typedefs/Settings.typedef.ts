export type Settings = {
  _id: string;
  key: 'question_intentions' | 'maintenance';
  inputType: 'multiopts' | 'binary';
  value: any;
  //value: QuestionIntentionsValue[] | MaintenanceMode;
};

export type IntentionId = 'question' | 'discussion' | 'advice' | 'information';

export type QuestionIntentionsValue = {
  id: IntentionId;
  label: string;
  active: boolean;
};

export type MaintenanceMode = {
  isMaintenanceMode: boolean;
};
