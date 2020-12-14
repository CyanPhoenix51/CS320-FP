import firebase from "firebase/app";
import "firebase/auth"; 
import "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCV04cZ-pknJwp3W9Aknrz3tNgKsAmWBOA",
  authDomain: "graph-theory-sketchbook.firebaseapp.com",
  databaseURL: "https://graph-theory-sketchbook.firebaseio.com",
  projectId: "graph-theory-sketchbook",
  storageBucket: "graph-theory-sketchbook.appspot.com",
  messagingSenderId: "33542383223",
  appId: "1:33542383223:web:db84e7c8b18cf2121b0872",
  measurementId: "G-PTLBR59D27"
};

firebase.initializeApp(firebaseConfig); 
export const auth = firebase.auth(); 
export const db = firebase.firestore(); 