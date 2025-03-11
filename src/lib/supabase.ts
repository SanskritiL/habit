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
  const isoDate = new Date(progress.date).toISOString();

  try {
    // Use upsert with onConflict to handle race conditions
    const { error } = await supabase
      .from('habit_progress')
      .upsert({
        habit_id: progress.habit_id,
        user_id: progress.user_id,
        date: isoDate,
        completed: progress.completed
      }, {
        onConflict: 'habit_id,date',
        ignoreDuplicates: false
      });

    if (error) {
      // Check if it's a unique constraint violation
      if (error.code === '23505') {
        console.warn('Concurrent update detected, retrying operation...');
        // Retry the update specifically
        const { error: retryError } = await supabase
          .from('habit_progress')
          .update({ completed: progress.completed })
          .eq('habit_id', progress.habit_id)
          .eq('date', isoDate);

        if (retryError) {
          console.error('Error in retry update:', retryError);
          throw retryError;
        }
      } else {
        console.error('Error updating habit progress:', error);
        throw error;
      }
    }
  } catch (err) {
    console.error('Failed to update habit progress:', err);
    throw err;
  }
}