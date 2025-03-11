 'use client';

import { useState } from 'react';
import { Habit } from '../types/habit';
import { COLORS } from '../constants/colors';

interface MonthlyViewProps {
  habits: Habit[];
  readOnly?: boolean; // Added readOnly prop
}

export function MonthlyView({ habits, readOnly = false }: MonthlyViewProps) {
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

  // Weekday abbreviations with unique keys
  const weekdays = [
    { key: 'sun', label: 'S' },
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' }
  ];

  // Get habit color based on ID - syncing with DailyView
  const getHabitColor = (id: string) => {
    const colors = [
      'bg-mint-300',
      'bg-rose-300',
      'bg-blue-300',
      'bg-purple-300',
      'bg-yellow-300',
    ];
    console.log("habit color is:")
    console.log(colors[parseInt(id) % colors.length])
    if (colors[parseInt(id) % colors.length] === undefined) {
      return colors[4];
    }
    return colors[parseInt(id) % colors.length];
  };

  return (
    <div className="space-y-4 max-w-full">
      <h2 className="text-lg font-light tracking-tight dark:text-gray-300">
        {today.toLocaleString('default', { month: 'long' })} {year}
      </h2>

      <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        {/* Compact weekday header with fixed unique keys */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day.key} className="text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {day.label}
              </span>
            </div>
          ))}
        </div>

        {/* Compact calendar grid */}
        <div className="grid grid-cols-7 gap-1">
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
                  aspect-square rounded-md border border-gray-100 dark:border-gray-700
                  relative flex flex-col min-h-[40px] max-h-[60px]
                  ${isToday ? 'ring-1 ring-gray-400 dark:ring-gray-500' : ''}
                  bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                `}
              >
                <span className="text-xs text-gray-600 dark:text-gray-400 absolute top-1 left-1">
                  {date}
                </span>
                {/* Compact habit indicators */}
                <div className="flex flex-wrap gap-1 mt-5 justify-center items-center">
                  {habits.map(habit => {
                    const isCompleted = habit.days[date];
                    return (
                      <div
                        key={`${date}-${habit.id}`}
                        className={`
                          w-2 h-2 rounded-full 
                          ${isCompleted ? getHabitColor(habit.id) : 'bg-gray-100 dark:bg-gray-700'}
                          ${isFutureDate ? 'opacity-50' : ''}
                        `}
                        title={`${habit.name}: ${isCompleted ? 'Completed' : isFutureDate ? 'Future date' : 'Not completed'}`}
                      />
                    );})}
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact Monthly Statistics */}
        <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-md bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Most Consistent</div>
              <div className="font-normal truncate dark:text-gray-300">
                {habits.length > 0
                  ? habits.reduce((prev, current) =>
                      getCompletionRate(current) > getCompletionRate(prev) ? current : prev
                    ).name
                  : 'None'}
              </div>
            </div>
            <div className="p-2 rounded-md bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Best Streak</div>
              <div className="font-normal dark:text-gray-300">
                {habits.length > 0
                  ? Math.max(...habits.map(getLongestStreak))
                  : 0} days
              </div>
            </div>
            <div className="p-2 rounded-md bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Progress</div>
              <div className="font-normal dark:text-gray-300">
                {habits.length > 0
                  ? Math.round(
                      habits.reduce((sum, habit) => sum + getCompletionRate(habit), 0) / habits.length
                    )
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}