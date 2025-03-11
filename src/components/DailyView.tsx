'use client';

import { useState } from 'react';
import { Habit } from '../types/habit';
import { COLORS } from '../constants/colors';

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

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-light tracking-tight dark:text-gray-200">
            Welcome back, {userName || 'there'}
          </h2>
          <h3 className="text-base text-gray-600 dark:text-gray-400 font-light">
            Track your daily progress
          </h3>
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
              bg-white/50 dark:bg-gray-800/50
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
                    border-2 ${habit.days[currentDay] ? 
                      `${COLORS[parseInt(habit.id) % COLORS.length]} scale-105` : 
                      'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
                  `}
                >
                  {habit.days[currentDay] && (
                    <span className="transform scale-90 text-gray-700 dark:text-gray-300">
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
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