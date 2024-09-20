<template>
  <div class="container">
    <h1>Queuely</h1>
    <div class="number-display">
      <h2>您抽到的號碼是</h2>
      <div class="current-number">{{ drawnNumber }}</div>
    </div>
    <div class="phone-input-container">
      <input v-model="phoneNumber" type="tel" placeholder="請輸入您的電話號碼" class="phone-input" />
      <button @click="submitPhoneNumber" :disabled="!phoneNumber" class="action-button">
        綁定號碼
      </button>
    </div>
    <div v-if="submitMessage" :class="['submit-message', { 'success': submitMessage.includes('成功') }]">
      {{ submitMessage }}
    </div>
    <button @click="goBack" class="action-button">返回首頁</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const router = useRouter();
const route = useRoute();
const drawnNumber = ref(0);
const phoneNumber = ref('');
const submitMessage = ref('');

onMounted(() => {
  const queryDrawnNumber = route.query.drawnNumber;
  if (queryDrawnNumber) {
    drawnNumber.value = parseInt(queryDrawnNumber);
  } else {
    router.push('/');
  }
});

async function submitPhoneNumber() {
  try {
    // 檢查電話號碼是否已經存在
    const phoneQuery = query(collection(db, "phoneNumbers"), where("phoneNumber", "==", phoneNumber.value));
    const phoneQuerySnapshot = await getDocs(phoneQuery);

    if (!phoneQuerySnapshot.empty) {
      submitMessage.value = '此電話號碼已經綁定過號碼，請使用其他電話號碼。';
      return;
    }

    // 檢查號碼文檔是否存在，如果不存在則創建
    const numberDocRef = doc(db, "numbers", drawnNumber.value.toString());
    const numberDocSnap = await getDoc(numberDocRef);

    if (!numberDocSnap.exists()) {
      // 如果文檔不存在，創建新文檔
      await setDoc(numberDocRef, {
        value: drawnNumber.value,
        phoneNumber: phoneNumber.value,
        timestamp: new Date()
      });
    } else {
      // 如果文檔存在，更新文檔
      await setDoc(numberDocRef, {
        phoneNumber: phoneNumber.value,
        timestamp: new Date()
      }, { merge: true });
    }

    // 創建電話號碼文檔
    await setDoc(doc(collection(db, "phoneNumbers"), phoneNumber.value), {
      phoneNumber: phoneNumber.value,
      drawnNumber: drawnNumber.value,
      timestamp: new Date()
    });

    submitMessage.value = '電話號碼已成功綁定！';
  } catch (error) {
    console.error("Error submitting phone number: ", error);
    submitMessage.value = `綁定失敗：${error.message}`;
  }
}

function goBack() {
  router.push('/');
}
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

.phone-input-container {
  margin: 20px 0;
}

.phone-input {
  font-size: 18px;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.action-button {
  font-size: 18px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

.action-button:hover:not(:disabled) {
  background-color: #45a049;
}

.action-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submit-message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
}

.submit-message.success {
  background-color: #4CAF50;
  color: white;
}

.submit-message:not(.success) {
  background-color: #f44336;
  color: white;
}
</style>