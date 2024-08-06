export interface User {
  name: string;
  id?: string;
  image: string;
  phoneNumber: string;
  description: string;
  text: string;
}

export interface Character {
  id: number;
  name: string;
  image: string;
  status: string;
  species: string;
}
