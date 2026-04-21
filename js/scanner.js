import { auth, db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { processFIFOSale } from './sales.js';

const codeReader = new ZXing.BrowserMultiFormatReader();
const videoEl = document.getElementById('video');

// Start Camera
codeReader.decodeFromVideoDevice(null, 'video', (result, err) => {
    if (result) {
        searchProduct(result.text);
    }
});

async function searchProduct(barcode) {
    const q = query(collection(db, "products"), 
              where("barcode", "==", barcode), 
              where("createdBy", "==", auth.currentUser.uid));
    
    const snap = await getDocs(q);
    if(snap.empty) return alert("Product not found");

    const prod = snap.docs[0].data();
    const id = snap.docs[0].id;

    document.getElementById('scan-result').style.display = 'block';
    document.getElementById('res-name').innerText = prod.name;
    
    // Total Stock Calculation
    const bSnap = await getDocs(query(collection(db, "batches"), where("productId", "==", id)));
    let total = 0;
    bSnap.forEach(b => total += b.data().quantity);
    document.getElementById('res-stock').innerText = total;

    document.getElementById('btn-sell-now').onclick = () => processFIFOSale(id, auth.currentUser.uid);
}

document.getElementById('btn-search').onclick = () => searchProduct(document.getElementById('manual-barcode').value);
