// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCjM349ORZDyE3F6UiKw7TrtNXPCRpgqPg",
    authDomain: "myfigmaprojects.firebaseapp.com",
    projectId: "myfigmaprojects",
    storageBucket: "myfigmaprojects.appspot.com", // Fixed typo in the storage bucket URL
    messagingSenderId: "406554604237",
    appId: "1:406554604237:web:14a0ea52fe2d6c49daaf84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);