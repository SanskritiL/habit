import { createClient } from '@supabase/supabase-js';
import { UUID } from 'crypto';

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

// Database helper functions
export async function getUserHabits(userId: string): Promise<UserHabit[]> {
  console.log("Getting user habits...")
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

  // Convert progress data into the days format
  const habitsWithProgress = habits?.map(habit => {
    const habitProgress = progress?.filter(p => p.habit_id === habit.id) || [];
    const days = {};
    
    habitProgress.forEach(p => {
      const date = new Date(p.date);
      days[date.getDate()] = p.completed;
    });

    return {
      ...habit,
      days
    };
  }) || [];

  return habitsWithProgress;
}

export async function createUserHabit(habit: Omit<UserHabit, 'id' | 'created_at'>): Promise<UserHabit> {
  console.log("creating user habits...")
  const { data, error } = await supabase
    .from('habits')
    .insert([habit])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHabitProgress(progress: Omit<HabitProgress, 'id'>): Promise<void> {
  console.log("updating habit progress...");
  try {
    const { error } = await supabase
      .from('habit_progress')
      .upsert([{
        ...progress,
        date: new Date(progress.date).toISOString(),
        habit_id: progress.habit_id // Ensure UUID format
      }]);

    if (error) {
      console.error('Error in updateHabitProgress:', error);
      throw error;
    }
  } catch (err) {
    console.error('Failed to update habit progress:', err);
    throw err;
  }
}