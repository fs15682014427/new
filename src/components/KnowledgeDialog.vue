<script setup>
import { ref } from 'vue'
  defineProps({
    title: String,
    drawer: Boolean
  })
  let direction = ref('rtl')

  const handleClose = () => {}
</script>

<template>
   <el-drawer
    :model="drawer"
    :title="title"
    :direction="direction"
    :before-close="handleClose"
  >
    <span>Hi, there!</span>
  </el-drawer>
</template>

<style lang="scss" scoped></style>