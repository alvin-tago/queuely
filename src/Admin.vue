<template>
  <div class="admin-container">
    <h1>Queuely Admin</h1>
    <div class="number-display">
      <h2>目前處理到的號碼</h2>
      <div class="current-number">{{ currentProcessingNumber }}</div>
    </div>
    <button @click="processNextNumber" class="process-button" :disabled="isProcessing">處理下一號</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from './firebase';

const currentProcessingNumber = ref(0);
const isProcessing = ref(false);

async function getCurrentProcessingNumber() {
  const docRef = doc(db, "counters", "processingCounter");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    currentProcessingNumber.value = docSnap.data().value;
  }
}

async function processNextNumber() {
  if (isProcessing.value) return;
  isProcessing.value = true;
  
  try {
    await runTransaction(db, async (transaction) => {
      const processingRef = doc(db, "counters", "processingCounter");
      const processingDoc = await transaction.get(processingRef);
      
      if (!processingDoc.exists()) {
        transaction.set(processingRef, { value: 1 });
        currentProcessingNumber.value = 1;
      } else {
        const newValue = processingDoc.data().value + 1;
        transaction.update(processingRef, { value: newValue });
        currentProcessingNumber.value = newValue;
      }
    });
    
    console.log("處理下一號：", currentProcessingNumber.value);
  } catch (e) {
    console.error("處理號碼時出錯: ", e);
  } finally {
    isProcessing.value = false;
  }
}

onMounted(async () => {
  await getCurrentProcessingNumber();
});
</script>

<style scoped>
.admin-container {
  text-align: center;
  padding: 20px;
}

.number-display {
  margin: 20px 0;
}

.current-number {
  font-size: 72px;
  font-weight: bold;
  color: #4a4a4a;
}

.process-button {
  font-size: 18px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

.process-button:hover:not(:disabled) {
  background-color: #45a049;
}

.process-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>