export type Settings = {
  _id: String;
  key: 'question_intentions';
  values: QuestionIntentionsValue[];
}

export type QuestionIntentionsValue = {
  id: 'question' | 'discussion' | 'advice' | 'information';
  label: String;
};
