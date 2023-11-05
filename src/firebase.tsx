import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrwP_oeRvUTd_D4ouZDsSQkPAoTojqsTs",
  authDomain: "padayon-2.firebaseapp.com",
  projectId: "padayon-2",
  storageBucket: "padayon-2.appspot.com",
  messagingSenderId: "424845286413",
  appId: "1:424845286413:web:18ab7c744811922fec4944",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
