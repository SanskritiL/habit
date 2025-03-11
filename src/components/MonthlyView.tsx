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
      <h2 className="text-xl font-light tracking-tight dark:text-gray-300">
        {today.toLocaleString('default', { month: 'long' })} {year}
      </h2>

      <div className="w-full bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center">
              <span className="font-light text-sm text-gray-500 dark:text-gray-400">
                {window.innerWidth > 640 ? day : day.charAt(0)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
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
                  aspect-square rounded-xl border border-gray-100 dark:border-gray-700
                  p-2 relative flex flex-col min-h-[100px]
                  ${isToday ? 'ring-2 ring-gray-400 dark:ring-gray-500 ring-offset-2' : ''}
                  bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                `}
              >
                <span className="text-sm text-gray-600 dark:text-gray-400 font-light absolute top-2 left-2">
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
                          w-4 h-4 rounded-full transition-all duration-300 transform
                          ${isCompleted ? COLORS[parseInt(habit.id) % COLORS.length] : 'bg-gray-100 dark:bg-gray-700'}
                          ${isFutureDate ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125'}
                        `}
                        title={`${habit.name}: ${isCompleted ? 'Completed' : 'Not completed'}`}
                      />
                    );})}
                </div>
              </div>
            );
          })}
        </div>

        {/* Monthly Statistics */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-light">
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Most Consistent Habit</div>
              <div className="text-lg font-normal dark:text-gray-300">
                {habits.length > 0
                  ? habits.reduce((prev, current) =>
                      getCompletionRate(current) > getCompletionRate(prev) ? current : prev
                    ).name
                  : 'No habits yet'}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">highest completion rate</div>
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Best Streak</div>
              <div className="text-lg font-normal dark:text-gray-300">
                {habits.length > 0
                  ? Math.max(...habits.map(getLongestStreak))
                  : 0} days
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">longest streak this month</div>
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Overall Progress</div>
              <div className="text-lg font-normal dark:text-gray-300">
                {habits.length > 0
                  ? Math.round(
                      habits.reduce((sum, habit) => sum + getCompletionRate(habit), 0) / habits.length
                    )
                  : 0}%
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">average completion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}