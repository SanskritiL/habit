'use client';
import { useState } from 'react';
import { Habit } from '../types/habit';
import Image from 'next/image';
import { updateHabitProgress } from '@/lib/supabase';

interface DailyViewProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, day: number) => void;
  onAddHabit: (name: string) => void;
  userName?: string;
}

export function DailyView({ habits, onToggleHabit, onAddHabit, userName }: DailyViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const currentDay = new Date().getDate();

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName('');
      setShowAddForm(false);
    }
  };

  const getHabitColor = (id: number) => {
    const colors = [
      'from-mint-200 to-mint-300',
      'from-pink-200 to-rose-200',
      'from-sky-200 to-blue-200',
      'from-violet-200 to-purple-200',
      'from-amber-200 to-yellow-200',
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
            <Image src="/avatar.png" alt="User avatar" fill className="object-cover" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-light tracking-tight dark:text-gray-200">
              Welcome back, {userName || 'there'}
            </h2>
            <h3 className="text-base text-gray-600 dark:text-gray-400 font-light">
              Track your daily progress
            </h3>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-2.5 text-sm bg-gray-900 text-white dark:bg-white dark:text-black
            rounded-full transition-all duration-300 hover:bg-gray-700 dark:hover:bg-gray-200
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          + New Habit
        </button>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`
              p-5 rounded-xl backdrop-blur-sm
              ${
                habit.days[currentDay]
                  ? `bg-gradient-to-r ${getHabitColor(parseInt(habit.id))}`
                  : 'bg-white dark:bg-gray-800'
              }
              border border-gray-100 dark:border-gray-700
              shadow-sm hover:shadow-md transition-all duration-300
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggleHabit(habit.id, currentDay)}
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center
                    transition-all duration-300 transform
                    ${
                      habit.days[currentDay]
                        ? 'bg-gray-900 dark:bg-gray-100'
                        : 'border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }
                  `}
                >
                  {habit.days[currentDay] && (
                    <span className="transform scale-90 text-white dark:text-gray-900 font-medium">
                      ✓
                    </span>
                  )}
                </button>
                <span className="text-gray-800 dark:text-gray-200 font-light">{habit.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-gray-800 dark:via-purple-900/30 dark:to-blue-900/30 p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
            <h3 className="text-xl mb-4 font-light dark:text-gray-200">New Habit</h3>
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-900 dark:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="What habit would you like to track?"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800
                  dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHabit}
                className="px-5 py-2 text-sm bg-gray-900 text-white dark:bg-white dark:text-black
                  rounded-lg transition-all duration-300 hover:bg-gray-700 dark:hover:bg-gray-200"
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
