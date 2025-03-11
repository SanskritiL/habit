'use client';

import { Habit } from '../types/habit';
import { COLORS } from '../constants/colors';

interface WeeklyViewProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, day: number) => void;
}

export function WeeklyView({ habits, onToggleHabit }: WeeklyViewProps) {
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
  const shortDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const getCompletionRate = (habit: Habit): number => {
    const completedDays = weekDates.filter(date => 
      habit.days[date.getDate()]
    ).length;
    return Math.round((completedDays / 7) * 100);
  };

  return (
    <div className="space-y-6 max-w-full">
      <h2 className="text-xl font-light tracking-tight dark:text-gray-300 px-4 sm:px-0">Weekly Progress</h2>
      
      <div className="w-full overflow-x-auto sm:overflow-visible bg-white dark:bg-gray-800 rounded-xl p-6 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="min-w-full grid grid-cols-[auto_repeat(1,1fr)] gap-4">
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

          <div className="flex-1 pl-4 space-x-6 flex overflow-x-auto">
            {habits.map(habit => (
              <div key={habit.id} className="flex-none w-24 space-y-3">
                <div className="h-12 flex items-end pb-2">
                  <div className="font-light text-sm text-gray-600 dark:text-gray-400 truncate">
                    {habit.name}
                  </div>
                </div>
                
                {weekDates.map((date, index) => {
                  // Debug logging remains the same
                  
                  const isCompleted = habit.days[date.getDate()];
                  const isFutureDate = date > today;
                  const colorClass = COLORS[parseInt(habit.id) % COLORS.length];
                  
                  const buttonClass = `
                      h-12 w-12 rounded-xl flex items-center justify-center
                      transition-all duration-300 transform
                      ${isCompleted 
                        ? `${colorClass} text-white shadow-md scale-105`
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}
                      backdrop-blur-sm
                      ${isFutureDate ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                    `;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => date <= today && onToggleHabit(habit.id, date.getDate())}
                      disabled={date > today}
                      className={buttonClass}                    
                      title={date > today ? 'Future date - cannot be completed yet' : ''}
                    >
                      {habit.days[date.getDate()] && (
                        <span className="transform scale-90 text-black font-medium">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}