// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2lLZVYkkxTMVtswVhtJUkQQwlaaGBnDg",
  authDomain: "lotova-sum-proj.firebaseapp.com",
  projectId: "lotova-sum-proj",
  storageBucket: "lotova-sum-proj.appspot.com",
  messagingSenderId: "463688856666",
  appId: "1:463688856666:web:3e565a3ead893b6f245463",
  measurementId: "G-ENGK42W8Q8"
};

// Инициализируем приложение
const app = initializeApp(firebaseConfig);

// Экспортируем сервисы для использования в других файлах
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);