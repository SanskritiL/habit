'use client';

import { useState } from 'react';
import { Habit } from '../types/habit';
import { COLORS } from '../constants/colors';

interface WeeklyViewProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, day: number) => void;
}

export function WeeklyView({ habits, onToggleHabit }: WeeklyViewProps) {
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const shortDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  // Generate array of dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const getCompletionRate = (habit: Habit) => {
    const completedDays = weekDates.filter(date => 
      habit.days[date.getDate()]
    ).length;
    return Math.round((completedDays / 7) * 100);
  };

  return (
    <div className="space-y-6 max-w-full">
      <h2 className="text-xl font-light tracking-tight dark:text-gray-300 px-4 sm:px-0">Weekly Progress</h2>
      
      <div className="w-full overflow-x-auto sm:overflow-visible bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="min-w-full grid grid-cols-[auto_repeat(1,1fr)] gap-4">
          {/* Days column */}
          <div className="space-y-3 pr-6 border-r border-gray-100 dark:border-gray-700">
            <div className="h-12 flex items-end justify-end pb-2">
              <span className="font-light text-sm text-gray-500 dark:text-gray-400">Days</span>
            </div>
            {weekDates.map((date, index) => (
              <div key={index} className="h-12 flex items-center justify-end">
                <div className="font-light text-sm text-gray-500 dark:text-gray-400">
                  <div className="hidden sm:block">{dayNames[date.getDay()]}</div>
                  <div className="sm:hidden">{shortDayNames[date.getDay()]}</div>
                  <div className="text-xs opacity-60">{date.getDate()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Habits grid */}
          <div className="flex-1 pl-4 space-x-6 flex overflow-x-auto">
            {habits.map(habit => (
              <div key={habit.id} className="flex-none w-24 space-y-3">
                <div className="h-12 flex items-end pb-2">
                  <div className="font-light text-sm text-gray-600 dark:text-gray-400 truncate">
                    {habit.name}
                  </div>
                </div>
                
                {weekDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => onToggleHabit(habit.id, date.getDate())}
                    className={`
                      h-12 w-12 rounded-xl flex items-center justify-center
                      transition-all duration-300 transform
                      border ${habit.days[date.getDate()] ? 
                        `${COLORS[parseInt(habit.id) % COLORS.length]} scale-105` : 
                        'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}
                      bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                    `}
                  >
                    {habit.days[date.getDate()] && (
                      <span className="transform scale-90 text-gray-700 dark:text-gray-300">✓</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Statistics */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-light">
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Best Day</div>
              <div className="text-lg font-normal dark:text-gray-300">Wednesday</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">5 habits completed</div>
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Week's Average</div>
              <div className="text-lg font-normal dark:text-gray-300">72%</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">completion rate</div>
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Current Streaks</div>
              <div className="text-lg font-normal dark:text-gray-300">3 habits</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">on track this week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}