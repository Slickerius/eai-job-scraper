export interface JobPostingAttributes {
  id?: string,
  title: string;
  publicationDate?: Date;
  location: string;
  company: string;
  source: string;
  url: string;
}
export interface QueryInterface {
  title: string[];
  publicationDate?: string;
  location: string[];
  company: string[];
}
export const DefaultQuery: QueryInterface = {
  title: [],
  location: [],
  company: [],
};
