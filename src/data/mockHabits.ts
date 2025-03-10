export interface HabitCategory {
  id: string;
  name: string;
}

export interface PresetHabit {
  id: string;
  name: string;
  category: string;
}

export const habitCategories: HabitCategory[] = [
  {
    id: 'wellness',
    name: 'Wellness'
  },
  {
    id: 'productivity',
    name: 'Productivity'
  },
  {
    id: 'fitness',
    name: 'Fitness'
  },
  {
    id: 'learning',
    name: 'Learning'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle'
  }
];

export const presetHabits: PresetHabit[] = [
  {
    id: 'water',
    name: 'Drink Water',
    category: 'wellness'
  },
  {
    id: 'exercise',
    name: 'Daily Exercise',
    category: 'fitness'
  },
  {
    id: 'meditation',
    name: 'Meditation',
    category: 'wellness'
  },
  {
    id: 'reading',
    name: 'Read Books',
    category: 'learning'
  },
  {
    id: 'coding',
    name: 'Code Practice',
    category: 'learning'
  },
  {
    id: 'sleep',
    name: 'Sleep Schedule',
    category: 'wellness'
  },
  {
    id: 'planning',
    name: 'Daily Planning',
    category: 'productivity'
  },
  {
    id: 'social',
    name: 'Social Connection',
    category: 'lifestyle'
  }
];