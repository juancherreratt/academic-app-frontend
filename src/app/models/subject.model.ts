export interface Subject {
  id: string;
  name: string;
  credits: number;
  teacher: {
    id: string;
    name: string;
  };
}
