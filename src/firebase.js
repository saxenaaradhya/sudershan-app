import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAJ5aPRrvdUdDVyR8BiV_tKam-ctd8cWVo",
  authDomain: "sudershan-2a044.firebaseapp.com",
  projectId: "sudershan-2a044",
  storageBucket: "sudershan-2a044.firebasestorage.app",
  messagingSenderId: "342728270456",
  appId: "1:342728270456:web:55d92fcde3badcc350038d"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)