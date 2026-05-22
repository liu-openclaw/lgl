<template>
  <div class="todo-container">
    <el-header class="todo-header">
      <div class="header-content">
        <h1>我的任务</h1>
        <div class="user-info">
          <span>欢迎，{{ username }}</span>
          <el-button type="danger" link @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>
    </el-header>

    <el-main class="todo-main">
      <TodoForm @add="handleAdd" />

      <div class="filter-bar">
        <el-radio-group v-model="filterStatus" size="small">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="pending">待办</el-radio-button>
          <el-radio-button label="completed">已完成</el-radio-button>
        </el-radio-group>
        <el-tag v-if="todos.length > 0" type="info">
          共 {{ todos.length }} 个任务
        </el-tag>
      </div>

      <TodoList
        :todos="filteredTodos"
        @toggle="handleToggle"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </el-main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import TodoForm from '../components/TodoForm.vue'
import TodoList from '../components/TodoList.vue'
import { getTodos, createTodo, updateTodo, deleteTodo as deleteTodoApi } from '../api/todo'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '')
const todos = ref([])
const filterStatus = ref('')

const filteredTodos = computed(() => {
  if (!filterStatus.value) return todos.value
  return todos.value.filter(todo => todo.status === filterStatus.value)
})

const fetchTodos = async () => {
  try {
    const res = await getTodos({ status: filterStatus.value || undefined })
    todos.value = res.data
  } catch (error) {
    console.error('获取任务失败:', error)
  }
}

const handleAdd = async (todoData) => {
  try {
    await createTodo(todoData)
    ElMessage.success('添加成功')
    fetchTodos()
  } catch (error) {
    console.error('添加任务失败:', error)
  }
}

const handleToggle = async (todo) => {
  try {
    const newStatus = todo.status === 'pending' ? 'completed' : 'pending'
    await updateTodo(todo.id, { status: newStatus })
    fetchTodos()
  } catch (error) {
    console.error('更新任务失败:', error)
  }
}

const handleEdit = async (todo) => {
  try {
    await updateTodo(todo.id, {
      title: todo.title,
      description: todo.description
    })
    ElMessage.success('更新成功')
    fetchTodos()
  } catch (error) {
    console.error('更新任务失败:', error)
  }
}

const handleDelete = async (todo) => {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteTodoApi(todo.id)
    ElMessage.success('删除成功')
    fetchTodos()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除任务失败:', error)
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  ElMessage.success('已退出登录')
  router.push('/login')
}

onMounted(() => {
  fetchTodos()
})
</script>

<style scoped>
.todo-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.todo-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-content h1 {
  font-size: 20px;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #606266;
}

.todo-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
