import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdg_HP-7S30Uc32r19AAhqIKbPpLsQlcg",
  authDomain: "padayon-df7dd.firebaseapp.com",
  projectId: "padayon-df7dd",
  storageBucket: "padayon-df7dd.appspot.com",
  messagingSenderId: "397961580325",
  appId: "1:397961580325:web:c224f96c1abde4cebf54cc",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
