// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "",
    authDomain: "cusatnotes-3a5a8.firebaseapp.com",
    projectId: "cusatnotes-3a5a8",
    storageBucket: "cusatnotes-3a5a8.appspot.com",
    messagingSenderId: "898423075930",
    appId: "1:898423075930:web:3b3a4d310f306d73379463",
    measurementId: "G-K61DDG7K40"
};


const app = initializeApp(firebaseConfig);
export const initFirebase = () => {
    return app;
}


