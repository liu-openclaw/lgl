# Todolist 项目设计文档

**日期**: 2026-05-21  
**技术栈**: Vue 3 + Node.js + Express + MySQL + JWT

---

## 1. 项目结构

```
todolist-project/
├── frontend/                    # Vite + Vue 3 + Element Plus
│   ├── src/
│   │   ├── views/
│   │   │   ├── Login.vue       # 登录页
│   │   │   └── Todo.vue        # 任务管理页
│   │   ├── components/
│   │   │   ├── TodoList.vue    # 任务列表
│   │   │   ├── TodoItem.vue    # 单个任务项
│   │   │   └── TodoForm.vue    # 添加/编辑表单
│   │   ├── api/
│   │   │   ├── request.js      # axios 封装 + 拦截器
│   │   │   ├── auth.js         # 认证相关 API
│   │   │   └── todo.js         # 任务相关 API
│   │   └── router/
│   │       └── index.js        # 路由配置 + 权限守卫
├── backend/                     # Node.js + Express
│   ├── routes/
│   │   ├── auth.js             # 登录/注册路由
│   │   └── todos.js            # 任务 CRUD 路由
│   ├── middleware/
│   │   └── auth.js             # JWT 验证中间件
│   └── db/
│       └── index.js            # MySQL 连接池
└── database/
    └── init.sql                # 数据库初始化脚本
```

---

## 2. 技术选型

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue 3 | ^3.4.0 |
| UI 组件库 | Element Plus | ^2.5.0 |
| 构建工具 | Vite | ^5.0.0 |
| HTTP 客户端 | Axios | ^1.6.0 |
| 后端框架 | Express | ^4.18.0 |
| 数据库 | MySQL | 8.0+ |
| 认证方式 | JWT | jsonwebtoken ^9.0.0 |
| 密码加密 | bcryptjs | ^2.4.0 |

---

## 3. 数据库设计

### 3.1 用户表 (users)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT AUTO_INCREMENT PK | 主键 |
| username | VARCHAR(50) UNIQUE NOT NULL | 用户名 |
| password_hash | VARCHAR(255) NOT NULL | 密码哈希 |
| created_at | TIMESTAMP DEFAULT NOW() | 创建时间 |

### 3.2 任务表 (todos)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT AUTO_INCREMENT PK | 主键 |
| user_id | INT NOT NULL FK | 所属用户 |
| title | VARCHAR(200) NOT NULL | 任务标题 |
| description | TEXT | 任务描述 |
| status | ENUM('pending', 'completed') DEFAULT 'pending' | 状态 |
| created_at | TIMESTAMP DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP DEFAULT NOW() ON UPDATE NOW() | 更新时间 |

---

## 4. API 接口规范

### 4.1 认证接口

| 方法 | 路径 | 描述 | 需要认证 |
|------|------|------|----------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 用户登录 | 否 |

**注册请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

**登录响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "jwt_token_string",
    "username": "string"
  }
}
```

### 4.2 任务接口

| 方法 | 路径 | 描述 | 需要认证 |
|------|------|------|----------|
| GET | /api/todos | 获取当前用户的所有任务 | 是 |
| POST | /api/todos | 创建新任务 | 是 |
| PUT | /api/todos/:id | 更新任务 | 是 |
| DELETE | /api/todos/:id | 删除任务 | 是 |

**统一响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

---

## 5. 页面设计

### 5.1 登录页 (Login.vue)

- 功能：用户登录/注册切换
- 表单字段：用户名、密码
- 登录成功后存储 token 到 localStorage

### 5.2 任务页 (Todo.vue)

布局：
```
┌─────────────────────────────────────┐
│  欢迎, xxx          [退出登录]      │
├─────────────────────────────────────┤
│  [输入框: 新任务...]  [添加按钮]    │
├─────────────────────────────────────┤
│  □ 任务1                    [编辑] │
│  ☑ 任务2 (已完成)           [删除] │
│  □ 任务3                    [删除] │
└─────────────────────────────────────┘
```

组件：
- **TodoForm**: 添加新任务表单
- **TodoList**: 任务列表容器
- **TodoItem**: 单个任务展示、编辑、删除、状态切换

---

## 6. 认证流程

1. 用户登录成功后，后端返回 JWT token
2. 前端将 token 存储到 localStorage
3. Axios 请求拦截器自动添加 `Authorization: Bearer <token>` 头
4. 后端 JWT 中间件验证 token 有效性
5. 路由守卫检查 token 存在性，无 token 重定向到登录页

---

## 7. 错误处理

### 7.1 前端错误处理

- Axios 响应拦截器统一处理错误
- 401: 清除 token，跳转登录页
- 其他错误: Element Plus Message 提示

### 7.2 后端错误处理

- 统一错误处理中间件
- 返回格式: `{ code: number, message: string, data: null }`

---

## 8. 功能清单

- [x] 用户注册
- [x] 用户登录
- [x] JWT Token 认证
- [x] 任务列表展示
- [x] 创建任务
- [x] 编辑任务
- [x] 删除任务
- [x] 任务状态切换（待办/已完成）
- [x] 仅查看自己的任务（数据隔离）

---

## 9. 运行环境

### 9.1 开发环境

- Node.js >= 18
- MySQL >= 8.0

### 9.2 启动命令

```bash
# 启动后端
cd backend && npm run dev

# 启动前端
cd frontend && npm run dev
```
