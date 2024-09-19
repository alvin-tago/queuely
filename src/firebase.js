import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBoSL41uHpp4XABax2rj2v64sMi9UZls08",
  authDomain: "queuely-fb5a5.firebaseapp.com",
  projectId: "queuely-fb5a5",
  storageBucket: "queuely-fb5a5.appspot.com",
  messagingSenderId: "382580939736",
  appId: "1:382580939736:web:c203b43bcadbb2016770ad",
  measurementId: "G-GT2QQCBV5L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };