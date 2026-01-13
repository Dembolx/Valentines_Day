dane
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACPfixM-BKteMjBuESK3exOkM_1bzuepc",
  authDomain: "walentynki-8579b.firebaseapp.com",
  databaseURL: "https://walentynki-8579b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "walentynki-8579b",
  storageBucket: "walentynki-8579b.firebasestorage.app",
  messagingSenderId: "882392949928",
  appId: "1:882392949928:web:0749e4afe49a2b44120e9d",
  measurementId: "G-3WH5K3CZS1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);