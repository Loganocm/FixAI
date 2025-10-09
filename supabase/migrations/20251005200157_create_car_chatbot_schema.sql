/*
  # Car Part Installer Chatbot Schema

  1. New Tables
    - `chat_sessions`
      - `id` (uuid, primary key) - Unique identifier for each chat session
      - `user_id` (uuid, nullable) - Optional user identification for future auth
      - `car_make` (text) - Car manufacturer (e.g., Toyota, Honda)
      - `car_model` (text) - Car model (e.g., Camry, Civic)
      - `car_year` (integer) - Year of the car
      - `part_name` (text) - Name of the part to install
      - `created_at` (timestamptz) - When the session was created
      - `updated_at` (timestamptz) - Last update timestamp

    - `chat_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `session_id` (uuid, foreign key) - References chat_sessions
      - `role` (text) - Either 'user' or 'assistant'
      - `content` (text) - The message content
      - `created_at` (timestamptz) - When the message was sent

  2. Security
    - Enable RLS on both tables
    - Allow public read/write access since this is a demo chatbot
    - In production, you would restrict to authenticated users only

  3. Indexes
    - Index on session_id for efficient message retrieval
    - Index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  car_make text NOT NULL,
  car_model text NOT NULL,
  car_year integer NOT NULL,
  part_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create chat sessions"
  ON chat_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view chat sessions"
  ON chat_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update chat sessions"
  ON chat_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can create messages"
  ON chat_messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
  ON chat_messages FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);