export type Settings = {
  _id: string;
  key: 'question_intentions' | 'maintenance' | 'defaultTheme';
  inputType: 'multiopts' | 'binary';
  value: any;
  //value: QuestionIntentionsValue[] | MaintenanceMode | DefaultThemeValue;
};

export type IntentionId = 'question' | 'discussion' | 'information';

export type QuestionIntentionsValue = {
  id: IntentionId;
  label: string;
  active: boolean;
};

export type MaintenanceMode = {
  isMaintenanceMode: boolean;
};

export type ThemeName = 'standard' | 'cozy' | 'honey';

export type DefaultThemeValue = {
  name: ThemeName;
};
