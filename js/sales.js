import { db } from './firebase.js';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function processFIFOSale(productId, userId) {
    const batchQuery = query(
        collection(db, "batches"),
        where("productId", "==", productId),
        where("createdBy", "==", userId),
        where("quantity", ">", 0),
        orderBy("expiryDate", "asc")
    );

    const snapshot = await getDocs(batchQuery);
    if (snapshot.empty) return alert("Out of stock!");

    const firstBatch = snapshot.docs[0];
    const newQty = firstBatch.data().quantity - 1;

    // Update Batch
    await updateDoc(doc(db, "batches", firstBatch.id), { quantity: newQty });

    // Record Sale
    await addDoc(collection(db, "sales"), {
        productId,
        batchId: firstBatch.id,
        soldAt: Timestamp.now(),
        createdBy: userId
    });

    alert("Sale complete!");
    location.reload();
}
