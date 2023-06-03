export type Country = {
  uid: string;
  founded_at: Date;
  dissolved_at?: Date;
  name_zeit: string;
  name_eng: string;
};

export interface PaginatedResponse {
  items: Object[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
