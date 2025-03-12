'use client';

import { Habit } from '../types/habit';

interface MonthlyViewProps {
  habits: Habit[];
  readOnly?: boolean;
}

export function MonthlyView({ habits }: MonthlyViewProps) {
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

  return (
    <div className="space-y-4 max-w-full">
      <h2 className="text-lg font-light tracking-tight dark:text-gray-300">
        {today.toLocaleString('default', { month: 'long' })} {year}
      </h2>

      <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-0.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-r border-gray-100 dark:border-gray-700">Date</th>
                {habits.map(habit => (
                  <th key={habit.id} className="py-2 px-0 w-8 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-r border-gray-100 dark:border-gray-700 h-16">
                    <div className="transform -rotate-90 origin-center">
                      {habit.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthDates.map(({ date, dayName }) => {
                const isToday = date === today.getDate();
                
                return (
                  <tr 
                    key={date}
                    className={`
                      group transition-colors duration-200
                      ${isToday ? 'bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-700/30 dark:to-gray-700/20' : ''}
                      hover:bg-gray-50/50 dark:hover:bg-gray-700/20
                    `}
                  >
                    <td className="p-1 border-t border-r border-gray-100 dark:border-gray-700">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{dayName}</span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{date}</span>
                      </div>
                    </td>
                    {habits.map(habit => (
                      <td key={habit.id} className="p-1 border-t border-r border-gray-100 dark:border-gray-700">
                        {habit.days[date] && (
                          <span className="
                            inline-flex items-center justify-center
                            w-3 h-3 rounded-full
                            bg-gradient-to-br from-gray-200/50 to-gray-300/50
                            dark:from-gray-600/50 dark:to-gray-700/50
                            text-gray-600 dark:text-gray-400 text-[10px]
                            transform transition-all duration-200
                            group-hover:scale-110
                          ">
                            ✓
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}