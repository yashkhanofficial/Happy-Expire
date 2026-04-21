import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const emailInp = document.getElementById('email');
const passInp = document.getElementById('password');

if(document.getElementById('btn-login')) {
    document.getElementById('btn-login').onclick = () => {
        signInWithEmailAndPassword(auth, emailInp.value, passInp.value)
            .then(() => window.location.href = 'dashboard.html')
            .catch(err => document.getElementById('auth-error').innerText = err.message);
    };
}

if(document.getElementById('btn-signup')) {
    document.getElementById('btn-signup').onclick = () => {
        createUserWithEmailAndPassword(auth, emailInp.value, passInp.value)
            .then(async (res) => {
                await setDoc(doc(db, "users", res.user.uid), {
                    email: emailInp.value,
                    createdAt: new Date()
                });
                window.location.href = 'dashboard.html';
            })
            .catch(err => document.getElementById('auth-error').innerText = err.message);
    };
}

if(document.getElementById('btn-logout')) {
    document.getElementById('btn-logout').onclick = () => signOut(auth).then(() => window.location.href = 'index.html');
}

onAuthStateChanged(auth, user => {
    if(!user && !window.location.pathname.includes('index.html')) window.location.href = 'index.html';
});
