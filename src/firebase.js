// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

// Экспортируем auth для использования в других файлах
export const auth = getAuth(app);
