<template>
  <div class="container">
    <h1>Queuely</h1>
    <div class="current-number">
      <h2>目前號碼</h2>
      <p class="number">{{ currentNumber }}</p>
    </div>
    <button @click="drawNumber" class="draw-button">我要抽號</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentNumber = ref(0)

function drawNumber() {
  currentNumber.value = Math.floor(Math.random() * 100) + 1
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.current-number {
  margin: 40px 0;
}

.number {
  font-size: 72px;
  font-weight: bold;
  color: #007bff;
}

.draw-button {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.draw-button:hover {
  background-color: #218838;
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .number {
    font-size: 48px;
  }

  .draw-button {
    font-size: 16px;
  }
}
</style>