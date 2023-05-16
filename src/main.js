import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/bootstrap/css/bootstrap.min.css'
import './assets/main.css'

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgmQNgB-6ClJpVVKSAik9HhDAqagI6yWk",
  authDomain: "sheetshare-75459.firebaseapp.com",
  projectId: "sheetshare-75459",
  storageBucket: "sheetshare-75459.appspot.com",
  messagingSenderId: "380729054735",
  appId: "1:380729054735:web:7d868f305560d4ef1c357a"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
getStorage(firebaseApp)

const app = createApp(App)

app.use(router)

app.mount('#app')
