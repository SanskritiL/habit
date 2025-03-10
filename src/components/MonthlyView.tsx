'use client';

import { useState } from 'react';
import { Habit } from '../types/habit';
import { COLORS } from '../constants/colors';

interface MonthlyViewProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, day: number) => void;
}

export function MonthlyView({ habits, onToggleHabit }: MonthlyViewProps) {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate array of dates for the month
  const monthDates = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return {
      date: i + 1,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  });

  const getCompletionRate = (habit: Habit) => {
    const completedDays = Object.values(habit.days).filter(Boolean).length;
    return Math.round((completedDays / daysInMonth) * 100);
  };

  const getLongestStreak = (habit: Habit) => {
    let currentStreak = 0;
    let maxStreak = 0;

    for (let i = 1; i <= daysInMonth; i++) {
      if (habit.days[i]) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  };

  // Get the first day of the month to calculate the calendar grid offset
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  return (
    <div className="space-y-6 max-w-full">
      <h2 className="text-xl font-mono dark:text-gray-300">
        {today.toLocaleString('default', { month: 'long' })} {year}
      </h2>

      <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center">
              <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                {window.innerWidth > 640 ? day : day.charAt(0)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 relative before:absolute before:inset-0 before:grid before:grid-cols-[repeat(20,1fr)] before:grid-rows-[repeat(20,1fr)] before:pointer-events-none before:content-[''] before:border-gray-100 dark:before:border-gray-800 before:[mask-image:linear-gradient(to_bottom,transparent_0,black_1px,black_calc(100%-1px),transparent_100%)] before:[mask-composite:exclude]">
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          
          {/* Calendar days */}
          {monthDates.map(({ date }) => {
            const isToday = date === today.getDate();
            const isFutureDate = new Date(year, month, date) > today;
            
            return (
              <div
                key={date}
                className={`
                  aspect-square rounded-lg border border-gray-200 dark:border-gray-700
                  p-2 relative flex flex-col min-h-[100px]
                  ${isToday ? 'ring-2 ring-black dark:ring-white ring-offset-2' : ''}
                  bg-[linear-gradient(to_right,rgba(209,213,219,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(209,213,219,0.1)_1px,transparent_1px)]
                  bg-[size:10px_10px]
                `}
              >
                <span className="text-sm text-gray-600 dark:text-gray-400 absolute top-2 left-2">
                  {date}
                </span>
                <div className="flex flex-wrap gap-2 mt-6 justify-start items-start p-1">
                  {habits.map(habit => {
                    const isCompleted = habit.days[date];
                    return (
                      <button
                        key={`${date}-${habit.id}`}
                        onClick={() => !isFutureDate && onToggleHabit(habit.id, date)}
                        disabled={isFutureDate}
                        className={`
                          w-4 h-4 rounded-full transition-all duration-200
                          ${isCompleted ? COLORS[parseInt(habit.id) % COLORS.length] : 'bg-gray-200 dark:bg-gray-700'}
                          ${isFutureDate ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125'}
                        `}
                        title={`${habit.name}: ${isCompleted ? 'Completed' : 'Not completed'}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Monthly Statistics */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-mono">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">Most Consistent Habit</div>
              <div className="text-lg font-bold dark:text-gray-300">
                {habits.length > 0
                  ? habits.reduce((prev, current) =>
                      getCompletionRate(current) > getCompletionRate(prev) ? current : prev
                    ).name
                  : 'No habits yet'}
              </div>
              <div className="text-gray-500 dark:text-gray-400">highest completion rate</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">Best Streak</div>
              <div className="text-lg font-bold dark:text-gray-300">
                {habits.length > 0
                  ? Math.max(...habits.map(getLongestStreak))
                  : 0} days
              </div>
              <div className="text-gray-500 dark:text-gray-400">longest streak this month</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">Overall Progress</div>
              <div className="text-lg font-bold dark:text-gray-300">
                {habits.length > 0
                  ? Math.round(
                      habits.reduce((sum, habit) => sum + getCompletionRate(habit), 0) / habits.length
                    )
                  : 0}%
              </div>
              <div className="text-gray-500 dark:text-gray-400">average completion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}