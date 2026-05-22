const users = [];
const todos = [];

let userIdCounter = 1;
let todoIdCounter = 1;

const db = {
  async execute(sql, params = []) {
    const sqlLower = sql.toLowerCase().trim();

    if (sqlLower.startsWith('select')) {
      if (sqlLower.includes('from users')) {
        if (sqlLower.includes('where username = ?')) {
          const username = params[0];
          const user = users.find(u => u.username === username);
          return [user ? [user] : []];
        }
        if (sqlLower.includes('where id = ?')) {
          const id = params[0];
          const user = users.find(u => u.id === id);
          return [user ? [user] : []];
        }
        return [[]];
      }

      if (sqlLower.includes('from todos')) {
        if (sqlLower.includes('where id = ?')) {
          const id = params[0];
          const todo = todos.find(t => t.id === id);
          return [todo ? [todo] : []];
        }
        if (sqlLower.includes('where user_id = ?')) {
          let result = todos.filter(t => t.user_id === params[0]);
          if (sqlLower.includes('and status = ?')) {
            const statusIndex = sqlLower.indexOf('and status = ?');
            const statusParamIndex = sqlLower.substring(0, statusIndex).split('?').length - 1;
            result = result.filter(t => t.status === params[statusParamIndex]);
          }
          return [result];
        }
        return [[]];
      }

      if (sqlLower.includes('select 1')) {
        return [[{ '1 + 1': 2 }]];
      }

      return [[]];
    }

    if (sqlLower.startsWith('insert')) {
      if (sqlLower.includes('into users')) {
        const [username, passwordHash] = params;
        const newUser = {
          id: userIdCounter++,
          username,
          password_hash: passwordHash,
          created_at: new Date()
        };
        users.push(newUser);
        return [{ insertId: newUser.id }];
      }

      if (sqlLower.includes('into todos')) {
        const [userId, title, description] = params;
        const newTodo = {
          id: todoIdCounter++,
          user_id: userId,
          title,
          description,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date()
        };
        todos.push(newTodo);
        return [{ insertId: newTodo.id }];
      }
    }

    if (sqlLower.startsWith('update')) {
      if (sqlLower.includes('todos')) {
        const setPart = sqlLower.substring(sqlLower.indexOf('set') + 4, sqlLower.indexOf('where'));
        const updateFields = setPart.split(',').map(s => s.trim());

        const id = params[params.length - 2];
        const userId = params[params.length - 1];

        const todo = todos.find(t => t.id === id && t.user_id === userId);
        if (todo) {
          let paramIndex = 0;
          if (sqlLower.includes('title')) {
            todo.title = params[paramIndex++];
          }
          if (sqlLower.includes('description')) {
            todo.description = params[paramIndex++];
          }
          if (sqlLower.includes('status')) {
            todo.status = params[paramIndex++];
          }
          todo.updated_at = new Date();
        }
        return [{ affectedRows: todo ? 1 : 0 }];
      }
    }

    if (sqlLower.startsWith('delete')) {
      if (sqlLower.includes('from todos')) {
        const id = params[0];
        const userId = params[1];
        const index = todos.findIndex(t => t.id === id && t.user_id === userId);
        if (index !== -1) {
          todos.splice(index, 1);
          return [{ affectedRows: 1 }];
        }
        return [{ affectedRows: 0 }];
      }
    }

    return [];
  },

  async query(sql, params = []) {
    return this.execute(sql, params);
  }
};

module.exports = db;