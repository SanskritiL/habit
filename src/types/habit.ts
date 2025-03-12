export interface Habit {
  id: string;
  user_id: string;
  name: string;
  days: { [key: number]: boolean };
}