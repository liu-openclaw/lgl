<template>
  <el-card class="todo-form-card" shadow="never">
    <el-form :model="form" @submit.prevent="handleSubmit">
      <el-row :gutter="12">
        <el-col :span="18">
          <el-input
            v-model="form.title"
            placeholder="输入新任务..."
            size="large"
            clearable
          />
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            size="large"
            :disabled="!form.title.trim()"
            @click="handleSubmit"
            style="width: 100%"
          >
            <el-icon><Plus /></el-icon>
            添加
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="showDescription" style="margin-top: 12px">
        <el-col :span="24">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            placeholder="任务描述（可选）"
          />
        </el-col>
      </el-row>
      <div class="form-actions">
        <el-button
          link
          type="primary"
          @click="showDescription = !showDescription"
        >
          {{ showDescription ? '隐藏描述' : '添加描述' }}
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['add'])

const showDescription = ref(false)
const form = reactive({
  title: '',
  description: ''
})

const handleSubmit = () => {
  const title = form.title.trim()
  if (!title) return

  emit('add', {
    title,
    description: form.description.trim() || undefined
  })

  // 重置表单
  form.title = ''
  form.description = ''
  showDescription.value = false
}
</script>

<style scoped>
.todo-form-card {
  margin-bottom: 20px;
}

.form-actions {
  margin-top: 8px;
  text-align: right;
}
</style>
