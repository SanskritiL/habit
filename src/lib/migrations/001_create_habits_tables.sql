-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    days JSONB DEFAULT '{}'
);

-- Create habit_progress table
CREATE TABLE IF NOT EXISTS habit_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, date)
);

-- Create indexes for better query performance
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habit_progress_habit_id ON habit_progress(habit_id);
CREATE INDEX idx_habit_progress_date ON habit_progress(date);
CREATE INDEX idx_habit_progress_user_date ON habit_progress(user_id, date);

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_habit_progress_updated_at
    BEFORE UPDATE ON habit_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();