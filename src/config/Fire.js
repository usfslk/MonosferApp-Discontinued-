import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = { 
    apiKey: "AIzaSyCmb8g2h0emVD4ecUPBHMuiC6Y-3YmCbzA",
    authDomain: "onepage-9752e.firebaseapp.com",
    databaseURL: "https://onepage-9752e.firebaseio.com",
    projectId: "onepage-9752e",
    storageBucket: "onepage-9752e.appspot.com",
    messagingSenderId: "771973453061"
};
const fire = firebase.initializeApp(config);
export default fire;