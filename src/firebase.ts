import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfY4QVrVecS_5lFFwn2Qwy9gh2Y25O168",
  authDomain: "nwitter-reloaded-2208f.firebaseapp.com",
  projectId: "nwitter-reloaded-2208f",
  storageBucket: "nwitter-reloaded-2208f.appspot.com",
  messagingSenderId: "415966068330",
  appId: "1:415966068330:web:5846b3f18e1bfdd675d413",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
