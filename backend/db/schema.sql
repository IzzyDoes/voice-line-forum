
-- Drop tables if they exist (for clean resets)
DROP TABLE IF EXISTS comment_votes;
DROP TABLE IF EXISTS post_votes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);

-- Create posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0
);

-- Create comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0
);

-- Create post_votes table to track user votes on posts
CREATE TABLE post_votes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Create comment_votes table to track user votes on comments
CREATE TABLE comment_votes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Add indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX idx_post_votes_user_id ON post_votes(user_id);
CREATE INDEX idx_comment_votes_comment_id ON comment_votes(comment_id);
CREATE INDEX idx_comment_votes_user_id ON comment_votes(user_id);

-- Insert an admin user (password: admin123)
INSERT INTO users (username, email, password, role, created_at)
VALUES ('admin', 'admin@leftplot.com', '$2b$10$rIC1S3DvGJqUfDYnLE6TL.C1x6HzDu/eBJsGF0K4CBSnGmzG4vKAS', 'admin', NOW());

-- Insert some regular users
INSERT INTO users (username, email, password, role, created_at)
VALUES 
  ('johndoe', 'john@example.com', '$2b$10$i2yh1tCEIia5XaRY6lMrDeYQ0.xHVfGYe4hVyXnV/vlZH5keGxO6S', 'user', NOW()),
  ('janedoe', 'jane@example.com', '$2b$10$8UrhZaJ5WOgJoIx7dCpvUeCvvFkeI2etrSWt5pKyRrE7QFLe5xJ9y', 'user', NOW()),
  ('political_pundit', 'pundit@example.com', '$2b$10$9Q.zF5pS1RCfEBQShZ2LK.TRJVrIHYQ/xBPQbvEjYUUt1UPr4xKbe', 'user', NOW());

-- Insert some sample posts
INSERT INTO posts (title, content, user_id, created_at, upvotes, downvotes)
VALUES 
  ('Universal Healthcare: A Right or a Privilege?', 'Healthcare is a fundamental human right that should be accessible to all citizens regardless of their socioeconomic status. Countries that have implemented universal healthcare systems have shown better health outcomes overall.', 2, NOW() - INTERVAL '3 days', 25, 5),
  ('Climate Change Legislation Needs to Go Further', 'While recent climate bills are a step in the right direction, they do not go far enough to address the urgency of the climate crisis. We need more aggressive carbon reduction targets and investment in renewable energy.', 3, NOW() - INTERVAL '2 days', 18, 7),
  ('Economic Inequality: The Growing Divide', 'The wealth gap in our country continues to widen at an alarming rate. We need to reassess our tax policies and social safety nets to ensure a more equitable distribution of resources.', 4, NOW() - INTERVAL '1 day', 30, 10);

-- Insert sample comments
INSERT INTO comments (post_id, user_id, content, created_at, upvotes, downvotes)
VALUES 
  (1, 3, 'I completely agree! Healthcare shouldn''t be a luxury that only the wealthy can afford.', NOW() - INTERVAL '2 days 12 hours', 15, 2),
  (1, 4, 'While I support universal healthcare in principle, I worry about the implementation costs and quality of care.', NOW() - INTERVAL '2 days 10 hours', 8, 5),
  (2, 2, 'The science is clear - we need to act now on climate change before it''s too late.', NOW() - INTERVAL '1 day 20 hours', 12, 3),
  (2, 4, 'I believe we need to balance environmental concerns with economic growth. Too strict regulations could hurt jobs.', NOW() - INTERVAL '1 day 18 hours', 6, 8),
  (3, 2, 'Progressive taxation is key to addressing wealth inequality.', NOW() - INTERVAL '20 hours', 10, 2),
  (3, 3, 'We should also focus on education and opportunity access, not just wealth redistribution.', NOW() - INTERVAL '15 hours', 9, 3);

-- Insert some sample votes
INSERT INTO post_votes (post_id, user_id, vote_type)
VALUES 
  (1, 2, 'upvote'),
  (1, 3, 'upvote'),
  (1, 4, 'downvote'),
  (2, 2, 'upvote'),
  (2, 3, 'downvote'),
  (3, 2, 'upvote'),
  (3, 3, 'upvote'),
  (3, 4, 'upvote');

INSERT INTO comment_votes (comment_id, user_id, vote_type)
VALUES 
  (1, 2, 'upvote'),
  (1, 4, 'upvote'),
  (2, 3, 'downvote'),
  (3, 4, 'upvote'),
  (4, 2, 'downvote'),
  (5, 3, 'upvote'),
  (6, 2, 'upvote');
