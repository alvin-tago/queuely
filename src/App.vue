<template>
  <div class="container">
    <router-view></router-view>
  </div>
  <title>Queuely</title> <!-- 保持前台不变 -->
</template>

<script setup>
// 这里不需要任何额外的脚本
</script>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
}
</style>