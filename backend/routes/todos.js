const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取当前用户的所有任务
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM todos WHERE user_id = ?';
    const params = [req.userId];

    if (status && ['pending', 'completed'].includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [todos] = await db.execute(query, params);

    res.json({
      code: 0,
      message: 'success',
      data: todos
    });
  } catch (error) {
    console.error('获取任务列表错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 创建新任务
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        code: 400,
        message: '任务标题不能为空',
        data: null
      });
    }

    const [result] = await db.execute(
      'INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)',
      [req.userId, title.trim(), description || null]
    );

    const [newTodo] = await db.execute(
      'SELECT * FROM todos WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      code: 0,
      message: '创建成功',
      data: newTodo[0]
    });
  } catch (error) {
    console.error('创建任务错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 更新任务
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // 检查任务是否存在且属于当前用户
    const [todos] = await db.execute(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (todos.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在',
        data: null
      });
    }

    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title.trim());
    }

    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }

    if (status && ['pending', 'completed'].includes(status)) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '没有要更新的字段',
        data: null
      });
    }

    params.push(id);
    params.push(req.userId);

    await db.execute(
      `UPDATE todos SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );

    const [updatedTodo] = await db.execute(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );

    res.json({
      code: 0,
      message: '更新成功',
      data: updatedTodo[0]
    });
  } catch (error) {
    console.error('更新任务错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 删除任务
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查任务是否存在且属于当前用户
    const [todos] = await db.execute(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (todos.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在',
        data: null
      });
    }

    await db.execute(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    res.json({
      code: 0,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    console.error('删除任务错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

module.exports = router;
