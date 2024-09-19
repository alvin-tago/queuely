<template>
  <div class="container">
    <h1>Queuely</h1>
    <div class="number-display">
      <h2>目前號碼</h2>
      <div class="current-number">{{ currentNumber }}</div>
    </div>
    <button @click="drawNumber" class="draw-button" :disabled="isDrawing">抽號碼</button>
    
    <div class="number-display">
      <h2>目前處理到的號碼</h2>
      <div class="current-number">{{ currentProcessingNumber }}</div>
    </div>
    
    <div class="waiting-info">
      <h3>您還需要等待 {{ currentNumber - currentProcessingNumber }} 號</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, doc, runTransaction, query, orderBy, limit, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const currentNumber = ref(0);
const currentProcessingNumber = ref(0);
const isDrawing = ref(false);

async function getLatestNumber() {
  const q = query(collection(db, "numbers"), orderBy("value", "desc"), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    currentNumber.value = querySnapshot.docs[0].data().value;
  }
}

async function getCurrentProcessingNumber() {
  const docRef = doc(db, "counters", "processingCounter");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    currentProcessingNumber.value = docSnap.data().value;
  }
}

async function drawNumber() {
  if (isDrawing.value) return;
  isDrawing.value = true;
  
  try {
    await runTransaction(db, async (transaction) => {
      const counterRef = doc(db, "counters", "numberCounter");
      const counterDoc = await transaction.get(counterRef);
      
      if (!counterDoc.exists()) {
        transaction.set(counterRef, { value: 1 });
        currentNumber.value = 1;
      } else {
        const newValue = counterDoc.data().value + 1;
        transaction.update(counterRef, { value: newValue });
        currentNumber.value = newValue;
      }
      
      // 添加新的号码记录
      const newNumberRef = doc(collection(db, "numbers"));
      transaction.set(newNumberRef, {
        value: currentNumber.value,
        timestamp: new Date()
      });
    });
    
    console.log("新号码已抽取：", currentNumber.value);
  } catch (e) {
    console.error("抽取号码时出错: ", e);
  } finally {
    isDrawing.value = false;
  }
}

onMounted(async () => {
  await getLatestNumber();
  await getCurrentProcessingNumber();
});
</script>

<style scoped>
.container {
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

.draw-button {
  font-size: 18px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

.draw-button:hover:not(:disabled) {
  background-color: #45a049;
}

.draw-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.waiting-info {
  margin-top: 20px;
  font-size: 24px;
  color: #4a4a4a;
}
</style>