-- Create projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  codename TEXT,
  description TEXT,
  tags JSONB,
  category TEXT,
  github TEXT,
  live TEXT,
  featured BOOLEAN DEFAULT false,
  accent TEXT
);

-- Create site table (only holds 1 row)
CREATE TABLE site (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT,
  role TEXT,
  bio TEXT,
  email TEXT,
  location TEXT,
  "calendarUrl" TEXT
);

-- Create skills table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  items JSONB NOT NULL
);

-- Create theme table (only holds 1 row)
CREATE TABLE theme (
  id INTEGER PRIMARY KEY DEFAULT 1,
  "accentColor" TEXT,
  "glassOpacity" TEXT,
  "borderRadius" TEXT,
  font TEXT
);
