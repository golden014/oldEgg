// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_DX1yPDOB3EHfU2lukV5QTnsxWtWl39c",
  authDomain: "oldegg-93db0.firebaseapp.com",
  databaseURL: "https://oldegg-93db0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "oldegg-93db0",
  storageBucket: "oldegg-93db0.appspot.com",
  messagingSenderId: "216385683285",
  appId: "1:216385683285:web:79acf23790ffc913ba39dc",
  measurementId: "G-N5Q0YXXEWT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
