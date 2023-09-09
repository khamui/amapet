export type Post = {
  id?: string;
  topics: string[];
  title: string;
  body: string;
  author: string;
  created?: Date;
}
