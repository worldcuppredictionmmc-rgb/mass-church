import {
    auth,
    db,
    collection,
    getDocs
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const welcomeName = document.getElementById("welcomeName");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";
        return;

    }

    const docRef = doc(db, "users", user.uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        welcomeName.innerHTML =
        `👋 Welcome, <b>${docSnap.data().name}</b>`;

    }
    await loadDashboardStats(user);

});

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "index.html";

});

const receivedCount = document.getElementById("receivedCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");
const totalAmount = document.getElementById("totalAmount");


export async function loadDashboardStats(user){

    const snapshot = await getDocs(

        collection(
            db,
            "users",
            user.uid,
            "entries"
        )

    );

    let received = 0;
    let celebrated = 0;
    let amount = 0;
    const monthStats = {};

    snapshot.forEach(doc => {

    const data = doc.data();

    received++;

    if(data.celebrated){

        celebrated++;

    }

    amount += Number(data.amount || 0);

    // Month Statistics
    if (!monthStats[data.month]) {

       monthStats[data.month] = {
    count: 0,
    amount: 0,
    pending: 0
};

    }

    monthStats[data.month].count++;

monthStats[data.month].amount += Number(data.amount || 0);

if(!data.celebrated){

    monthStats[data.month].pending++;

}
});

    receivedCount.innerText = received;

    document.querySelectorAll(".month-card").forEach(card => {

    const month = card.dataset.month;

    const stats = monthStats[month];

    card.querySelector(".month-count").innerText =
    stats ? `📥 ${stats.count} Entries` : "📥 0 Entries";

card.querySelector(".month-pending").innerText =
    stats ? `⏳ ${stats.pending} Pending` : "⏳ 0 Pending";

card.querySelector(".month-amount").innerText =
    stats ? `💰 ₹${stats.amount}` : "💰 ₹0";

});

    completedCount.innerText = celebrated;

    remainingCount.innerText = received - celebrated;

    totalAmount.innerText = `₹${amount.toLocaleString("en-IN")}`;

}