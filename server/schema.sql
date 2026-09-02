CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Администратор',
  password_hash TEXT
);

CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  oo TEXT UNIQUE,
  msu TEXT,
  city TEXT,
  ppe TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS imports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_name TEXT,
  stored_path TEXT,
  year INTEGER,
  subject TEXT,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS protocols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id TEXT REFERENCES schools(id),
  year INTEGER NOT NULL,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  exam_date TEXT,
  status TEXT NOT NULL DEFAULT 'imported',
  import_id INTEGER REFERENCES imports(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (school_id, year, subject)
);

CREATE TABLE IF NOT EXISTS protocol_columns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  protocol_id INTEGER NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS protocol_students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  protocol_id INTEGER NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  row_no INTEGER,
  last_name TEXT,
  first_name TEXT,
  middle_name TEXT,
  klass TEXT,
  room TEXT,
  msu TEXT,
  oo TEXT,
  ppe TEXT,
  series TEXT,
  number TEXT,
  short_answers TEXT,
  long_answers TEXT,
  primary_score REAL,
  test_score REAL,
  mark TEXT,
  cells_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id TEXT REFERENCES schools(id),
  protocol_id INTEGER REFERENCES protocols(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  format TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  file_path TEXT
);

CREATE INDEX IF NOT EXISTS idx_students_protocol ON protocol_students(protocol_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON protocol_students(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_students_score ON protocol_students(test_score);
CREATE INDEX IF NOT EXISTS idx_protocols_school_year ON protocols(school_id, year);
