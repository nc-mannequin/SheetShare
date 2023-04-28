import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/bootstrap/css/bootstrap.min.css'
import './assets/main.css'

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDmpQpD4A2xZP_UCzZNrG7jjiKRkNe2Z_4",
    authDomain: "sheetshare-7e0d8.firebaseapp.com",
    projectId: "sheetshare-7e0d8",
    storageBucket: "sheetshare-7e0d8.appspot.com",
    messagingSenderId: "981999077230",
    appId: "1:981999077230:web:7a9f65b720039d6cd5237f",
    measurementId: "G-7DXFYDKL4Z"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
getStorage(firebaseApp)

const app = createApp(App)

app.use(router)

app.mount('#app')
