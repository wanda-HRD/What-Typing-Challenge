import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 여기에 Firebase 콘솔에서 복사한 설정값을 넣어야 해!
const firebaseConfig = {
    apiKey: "AIzaSyDIMgMcp2g7C3BKk4_7-7xxwkrqGooMZVg",
    authDomain: "what-typing-challenge.firebaseapp.com",
    projectId: "what-typing-challenge",
    storageBucket: "what-typing-challenge.firebasestorage.app",
    messagingSenderId: "185088538436",
    appId: "1:185088538436:web:a283861d27e78d2e10c911"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
