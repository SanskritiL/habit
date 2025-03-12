import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export interface UserHabit {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  days: { [key: number]: boolean };
}

export interface HabitProgress {
  id: string;
  user_id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export async function getUserHabits(userId: string): Promise<UserHabit[]> {
  console.log("getting user habits....")
  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId);

  if (habitsError) throw habitsError;

  const { data: progress, error: progressError } = await supabase
    .from('habit_progress')
    .select('*')
    .eq('user_id', userId);

  if (progressError) throw progressError;

  return habits?.map(habit => {
    const habitProgress = progress?.filter(p => p.habit_id === habit.id) || [];
    const days = {};
    
    habitProgress.forEach(p => {
      const date = new Date(p.date);
      (days as { [key: number]: boolean })[date.getDate()] = p.completed;
    });

    return {
      ...habit,
      days
    };
  }) || [];
}

export async function updateHabitProgress(progress: Omit<HabitProgress, 'id'>): Promise<void> {
  console.log("updating user habits....")

  const formattedDate = new Date(progress.date).toISOString();
  
  const { data: existingProgress } = await supabase
    .from('habit_progress')
    .select('id')
    .eq('habit_id', progress.habit_id)
    .eq('date', formattedDate)
    .maybeSingle();

  if (existingProgress) {
    await supabase
      .from('habit_progress')
      .update({ completed: progress.completed })
      .eq('id', existingProgress.id);
  } else {
    await supabase
      .from('habit_progress')
      .insert([{
        ...progress,
        date: formattedDate
      }]);
  }
}

export async function createUserHabit(habit: Omit<UserHabit, 'id' | 'created_at'>): Promise<UserHabit> {
  console.log("creating user habits....")
  const { data, error } = await supabase
    .from('habits')
    .insert([habit])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUserHabit(habitId: string): Promise<void> {
  console.log("deleting user habit....")
  
  // First delete all progress records for this habit
  const { error: progressError } = await supabase
    .from('habit_progress')
    .delete()
    .eq('habit_id', habitId);

  if (progressError) throw progressError;

  // Then delete the habit itself
  const { error: habitError } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId);

  if (habitError) throw habitError;
}