<template>
  <div class="todo-list">
    <el-empty
      v-if="todos.length === 0"
      description="暂无任务"
      :image-size="120"
    />
    <div v-else class="todo-items">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="$emit('toggle', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import TodoItem from './TodoItem.vue'

defineProps({
  todos: {
    type: Array,
    default: () => []
  }
})

defineEmits(['toggle', 'edit', 'delete'])
</script>

<style scoped>
.todo-list {
  background-color: #fff;
  border-radius: 8px;
  min-height: 200px;
}

.todo-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
