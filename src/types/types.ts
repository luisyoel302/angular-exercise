export interface User {
  name: string;
  id?: string;
  image: string;
  phone: string;
  description: string;
  text: string;
}

export interface Pagination {
  lastEvaluatedKey: { id: string } | null;
  data: User[];
}
export interface Character {
  id: number;
  name: string;
  image: string;
  status: string;
  species: string;
}
