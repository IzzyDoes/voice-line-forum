
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get all posts with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, sort = 'recent' } = req.query;
    const limit = 5; // 5 posts per page
    const offset = (page - 1) * limit;
    
    let orderBy;
    switch (sort) {
      case 'upvotes':
        orderBy = 'upvotes DESC';
        break;
      case 'downvotes':
        orderBy = 'downvotes DESC';
        break;
      case 'comments':
        orderBy = 'comment_count DESC';
        break;
      case 'recent':
      default:
        orderBy = 'created_at DESC';
    }
    
    const db = req.app.locals.db;
    
    const query = `
      SELECT p.*, u.username, COUNT(c.id) AS comment_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id, u.username
      ORDER BY ${orderBy}
      LIMIT $1 OFFSET $2
    `;
    
    const { rows } = await db.query(query, [limit, offset]);
    
    // Get total count for pagination
    const { rows: countRows } = await db.query('SELECT COUNT(*) FROM posts');
    const totalPosts = parseInt(countRows[0].count);
    const totalPages = Math.ceil(totalPosts / limit);
    
    res.json({
      posts: rows,
      pagination: {
        total: totalPosts,
        pages: totalPages,
        current: parseInt(page)
      }
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Get a single post by ID with its comments
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    
    // Get post details
    const { rows } = await db.query(
      `SELECT p.*, u.username
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Get comments for the post
    const { rows: comments } = await db.query(
      `SELECT c.*, u.username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.upvotes DESC, c.created_at DESC`,
      [id]
    );
    
    res.json({
      ...rows[0],
      comments
    });
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
});

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    if (content.length > 500) {
      return res.status(400).json({ error: 'Content cannot exceed 500 characters' });
    }
    
    const db = req.app.locals.db;
    const { rows } = await db.query(
      `INSERT INTO posts (title, content, user_id, created_at, upvotes, downvotes)
       VALUES ($1, $2, $3, NOW(), 0, 0)
       RETURNING *`,
      [title, content, userId]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update a post (title and content)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    if (content.length > 500) {
      return res.status(400).json({ error: 'Content cannot exceed 500 characters' });
    }
    
    const db = req.app.locals.db;
    
    // Check if user owns the post
    const { rows: checkRows } = await db.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [id]
    );
    
    if (checkRows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (checkRows[0].user_id !== userId) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }
    
    const { rows } = await db.query(
      `UPDATE posts
       SET title = $1, content = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, content, id, userId]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete a post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const db = req.app.locals.db;
    
    // Check if user owns the post or is admin
    const { rows: checkRows } = await db.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [id]
    );
    
    if (checkRows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is post owner or admin
    const { rows: userRows } = await db.query(
      'SELECT role FROM users WHERE id = $1',
      [userId]
    );
    
    const isAdmin = userRows[0].role === 'admin';
    
    if (checkRows[0].user_id !== userId && !isAdmin) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }
    
    // Delete all comments for the post first
    await db.query('DELETE FROM comments WHERE post_id = $1', [id]);
    
    // Delete the post
    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Upvote a post
router.post('/:id/upvote', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const db = req.app.locals.db;
    
    // Check if user has already voted on this post
    const { rows: voteCheck } = await db.query(
      'SELECT * FROM post_votes WHERE post_id = $1 AND user_id = $2',
      [id, userId]
    );
    
    // Begin transaction
    await db.query('BEGIN');
    
    if (voteCheck.length > 0) {
      const existingVote = voteCheck[0];
      
      if (existingVote.vote_type === 'upvote') {
        // Already upvoted, remove the vote
        await db.query(
          'DELETE FROM post_votes WHERE post_id = $1 AND user_id = $2',
          [id, userId]
        );
        
        await db.query(
          'UPDATE posts SET upvotes = upvotes - 1 WHERE id = $1',
          [id]
        );
      } else {
        // Change downvote to upvote
        await db.query(
          'UPDATE post_votes SET vote_type = $1 WHERE post_id = $2 AND user_id = $3',
          ['upvote', id, userId]
        );
        
        await db.query(
          'UPDATE posts SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = $1',
          [id]
        );
      }
    } else {
      // New vote
      await db.query(
        'INSERT INTO post_votes (post_id, user_id, vote_type) VALUES ($1, $2, $3)',
        [id, userId, 'upvote']
      );
      
      await db.query(
        'UPDATE posts SET upvotes = upvotes + 1 WHERE id = $1',
        [id]
      );
    }
    
    // Commit transaction
    await db.query('COMMIT');
    
    // Get updated post
    const { rows } = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error upvoting post:', error);
    res.status(500).json({ error: 'Failed to upvote post' });
  }
});

// Downvote a post
router.post('/:id/downvote', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const db = req.app.locals.db;
    
    // Check if user has already voted on this post
    const { rows: voteCheck } = await db.query(
      'SELECT * FROM post_votes WHERE post_id = $1 AND user_id = $2',
      [id, userId]
    );
    
    // Begin transaction
    await db.query('BEGIN');
    
    if (voteCheck.length > 0) {
      const existingVote = voteCheck[0];
      
      if (existingVote.vote_type === 'downvote') {
        // Already downvoted, remove the vote
        await db.query(
          'DELETE FROM post_votes WHERE post_id = $1 AND user_id = $2',
          [id, userId]
        );
        
        await db.query(
          'UPDATE posts SET downvotes = downvotes - 1 WHERE id = $1',
          [id]
        );
      } else {
        // Change upvote to downvote
        await db.query(
          'UPDATE post_votes SET vote_type = $1 WHERE post_id = $2 AND user_id = $3',
          ['downvote', id, userId]
        );
        
        await db.query(
          'UPDATE posts SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = $1',
          [id]
        );
      }
    } else {
      // New vote
      await db.query(
        'INSERT INTO post_votes (post_id, user_id, vote_type) VALUES ($1, $2, $3)',
        [id, userId, 'downvote']
      );
      
      await db.query(
        'UPDATE posts SET downvotes = downvotes + 1 WHERE id = $1',
        [id]
      );
    }
    
    // Commit transaction
    await db.query('COMMIT');
    
    // Get updated post
    const { rows } = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error downvoting post:', error);
    res.status(500).json({ error: 'Failed to downvote post' });
  }
});

module.exports = router;
