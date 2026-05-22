<template>
  <div
    class="todo-item"
    :class="{ 'is-completed': todo.status === 'completed' }"
  >
    <el-checkbox
      :model-value="todo.status === 'completed'"
      @change="$emit('toggle', todo)"
      size="large"
    />

    <div class="todo-content" v-if="!isEditing">
      <div class="todo-title">{{ todo.title }}</div>
      <div class="todo-description" v-if="todo.description">
        {{ todo.description }}
      </div>
      <div class="todo-meta">
        <el-tag
          :type="todo.status === 'completed' ? 'success' : 'warning'"
          size="small"
        >
          {{ todo.status === 'completed' ? '已完成' : '待办' }}
        </el-tag>
        <span class="todo-time">{{ formatTime(todo.created_at) }}</span>
      </div>
    </div>

    <div class="todo-edit-form" v-else>
      <el-input v-model="editForm.title" placeholder="任务标题" />
      <el-input
        v-model="editForm.description"
        type="textarea"
        :rows="2"
        placeholder="任务描述"
        style="margin-top: 8px"
      />
    </div>

    <div class="todo-actions">
      <template v-if="!isEditing">
        <el-button
          link
          type="primary"
          :icon="Edit"
          @click="startEdit"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          :icon="Delete"
          @click="$emit('delete', todo)"
        >
          删除
        </el-button>
      </template>
      <template v-else>
        <el-button
          link
          type="primary"
          :icon="Check"
          @click="saveEdit"
        >
          保存
        </el-button>
        <el-button
          link
          :icon="Close"
          @click="cancelEdit"
        >
          取消
        </el-button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Edit, Delete, Check, Close } from '@element-plus/icons-vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'edit', 'delete'])

const isEditing = ref(false)
const editForm = reactive({
  title: '',
  description: ''
})

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const startEdit = () => {
  editForm.title = props.todo.title
  editForm.description = props.todo.description || ''
  isEditing.value = true
}

const saveEdit = () => {
  const title = editForm.title.trim()
  if (!title) return

  emit('edit', {
    ...props.todo,
    title,
    description: editForm.description.trim()
  })
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.todo-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.todo-item.is-completed {
  background-color: #f5f7fa;
}

.todo-item.is-completed .todo-title {
  text-decoration: line-through;
  color: #909399;
}

.todo-content {
  flex: 1;
  min-width: 0;
}

.todo-title {
  font-size: 16px;
  color: #303133;
  word-break: break-word;
}

.todo-description {
  font-size: 14px;
  color: #606266;
  margin-top: 4px;
  word-break: break-word;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.todo-time {
  font-size: 12px;
  color: #909399;
}

.todo-edit-form {
  flex: 1;
}

.todo-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>
