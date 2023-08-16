import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBg6rw0YS1X3lKVPzFaV0UDPBIaBuY1e0",
  authDomain: "web-task-9c56c.firebaseapp.com",
  projectId: "web-task-9c56c",
  storageBucket: "web-task-9c56c.appspot.com",
  messagingSenderId: "837278151439",
  appId: "1:837278151439:web:b2a134001f6b9d8857047a",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
export { db };
