'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ViewSelector, ViewType } from '@/components/ViewSelector';
import { DailyView } from '@/components/DailyView';
import { MonthlyView } from '@/components/MonthlyView';
import { Habit } from '@/types/habit';
import { getUserHabits, createUserHabit, updateHabitProgress, deleteUserHabit } from '@/lib/supabase';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { presetHabits } from '@/data/mockHabits';

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [selectedPresetHabits, setSelectedPresetHabits] = useState<Set<string>>(new Set());
  const [showWelcome, setShowWelcome] = useState(true);
  const { signOut } = useClerk();

  const handleDeleteHabit = async (habitId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteUserHabit(habitId);
      const updatedHabits = habits.filter(habit => habit.id !== habitId);
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetHabitToggle = (habitId: string) => {
    setSelectedPresetHabits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(habitId)) {
        newSet.delete(habitId);
      } else {
        newSet.add(habitId);
      }
      return newSet;
    });
  };

  const handleStartWithPresetHabits = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const selectedHabits = presetHabits.filter(habit => selectedPresetHabits.has(habit.id));
      
      for (const habit of selectedHabits) {
        await createUserHabit({
          user_id: user.id,
          name: habit.name,
          days: {}
        });
      }

      const userHabits = await getUserHabits(user.id);
      setHabits(userHabits);
      setIsFirstTimeUser(false);
      setShowWelcome(false);
    } catch (error) {
      console.error('Error creating preset habits:', error);
      setError('Failed to set up initial habits. Please try again.');
    }

    setIsLoading(false);
  };

  const toggleHabitDay = async (habitId: string, day: number) => {
    if (!user) return;

    // Prevent modifications to future dates
    const today = new Date();
    const selectedDate = new Date(today.getFullYear(), today.getMonth(), day);
    if (selectedDate > today) {
      setError('Cannot modify future dates');
      return;
    }
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          days: {
            ...habit.days,
            [day]: !habit.days[day]
          }
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    
    try {
      const habitToUpdate = updatedHabits.find(h => h.id === habitId);
      if (habitToUpdate) {
        await updateHabitProgress({
          user_id: user.id,
          habit_id: habitId,
          date: selectedDate.toISOString(),
          completed: !!habitToUpdate.days[day]
        });
      }
    } catch (error) {
      console.error('Error updating habit progress:', error);
      setError('Failed to update habit progress. Please try again.');
    }
  };

  useEffect(() => {
    if (isSignedIn && user) {
      setIsLoading(true);
      setError(null);
      getUserHabits(user.id)
        .then(userHabits => {
          if (userHabits.length > 0) {
            setIsFirstTimeUser(false);
            setShowWelcome(false);
          }
          setHabits(userHabits);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading habits:', error);
          setError('Failed to load habits. Please try again.');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [isSignedIn, user]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-2xl font-mono mb-4 dark:text-gray-300">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-80"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-mono mb-4 dark:text-gray-300">Welcome to Habit Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Please sign in to start tracking your habits</p>
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-80"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto">
        {showWelcome && isFirstTimeUser ? (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h1 className="text-2xl font-mono mb-4 dark:text-gray-300">
              Welcome, {user.firstName || user.username}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
            Let&apos;s get started by selecting some habits you&apos;d like to track. You can always add more later.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {presetHabits.map(habit => (
                <div
                  key={habit.id}
                  onClick={() => handlePresetHabitToggle(habit.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedPresetHabits.has(habit.id)
                      ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-700'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <h3 className="font-mono text-lg mb-2 dark:text-gray-300">{habit.name}</h3>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsFirstTimeUser(false);
                  setShowWelcome(false);
                }}
                className="px-4 py-2 text-sm font-mono text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Skip
              </button>
              <button
                onClick={handleStartWithPresetHabits}
                className="px-5 py-2 text-sm bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-80"
                disabled={selectedPresetHabits.size === 0}
              >
                Start Tracking
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:opacity-80 transition-opacity"
              >
                Sign Out
              </button>
            </div>
            {currentView === 'daily' ? (
              <DailyView
                habits={habits}
                onToggleHabit={toggleHabitDay}
                onAddHabit={async (name) => {
                  if (!user) return;
                  try {
                    await createUserHabit({
                      user_id: user.id,
                      name,
                      days: {}
                    });
                    const updatedHabits = await getUserHabits(user.id);
                    setHabits(updatedHabits);
                  } catch (error) {
                    console.error('Error creating habit:', error);
                    setError('Failed to create habit. Please try again.');
                  }
                }}
                onDeleteHabit={handleDeleteHabit}
                userName={user.firstName ?? user.username ?? ''}
              />
            ) : (
              <MonthlyView habits={habits} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
