import { auth, db } from './firebase.js';
import { collection, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadDashboard() {
    const uid = auth.currentUser.uid;
    const now = new Date();

    const getTimeline = (days) => {
        const d = new Date();
        d.setDate(now.getDate() + days);
        return Timestamp.fromDate(d);
    };

    const batchesRef = collection(db, "batches");
    
    // Load counts and logic for lists
    const snap = await getDocs(query(batchesRef, where("createdBy", "==", uid), where("quantity", ">", 0)));
    
    snap.forEach(doc => {
        const data = doc.data();
        const exp = data.expiryDate.toDate();
        const diff = (exp - now) / (1000 * 60 * 60 * 24);
        
        let targetList = "";
        if (diff <= 3) targetList = "list-3-days";
        else if (diff <= 7) targetList = "list-7-days";
        else if (diff <= 30) targetList = "list-30-days";

        if(targetList) {
            const el = document.createElement('div');
            el.className = `alert-item ${targetList.replace('list', 'border')}`;
            el.innerHTML = `<b>${data.quantity} units</b> expiring on ${exp.toLocaleDateString()}`;
            document.getElementById(targetList).appendChild(el);
        }
    });
}

auth.onAuthStateChanged(user => { if(user) loadDashboard(); });
