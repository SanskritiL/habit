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
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-mono dark:text-gray-300">
            Hi, {userName || 'there'}! 👋
          </h2>
          <h3 className="text-lg font-mono dark:text-gray-300">Today's Habits</h3>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 text-sm font-mono bg-black text-white dark:bg-white dark:text-black hover:opacity-80 rounded-lg"
          >
            Add Habit
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`
              p-4 rounded-lg border-2 ${COLORS[parseInt(habit.id) % COLORS.length]} transition-all duration-200
              bg-[linear-gradient(to_right,rgba(209,213,219,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(209,213,219,0.1)_1px,transparent_1px)]
              bg-[size:10px_10px]
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggleHabit(habit.id, currentDay)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 transform ${habit.days[currentDay] ? `${COLORS[parseInt(habit.id) % COLORS.length]} border-opacity-100` : 'bg-transparent hover:scale-105'}`}
                >
                  {habit.days[currentDay] && (
                    <span className="transform transition-transform duration-300 scale-100 text-gray-600 dark:text-gray-300">
                      ✓
                    </span>
                  )}
                </button>
                <span className="font-mono dark:text-gray-300">{habit.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-mono mb-4 dark:text-gray-300">Add New Habit</h3>
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-gray-300"
              placeholder="Enter habit name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-mono text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHabit}
                className="px-4 py-2 text-sm font-mono bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}