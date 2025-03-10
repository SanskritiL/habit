export interface Habit {
  id: string;
  name: string;
  days: { [key: number]: boolean };
}