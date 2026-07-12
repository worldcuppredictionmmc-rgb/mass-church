import {
    auth,
    db,
    collection,
    addDoc,
    serverTimestamp
} from "./firebase.js";

const modal = document.getElementById("massModal");

const closeModal = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelBtn");

const months = document.querySelectorAll(".month-card");

const saveBtn = document.getElementById("saveBtn");

const massDate = document.getElementById("massDate");

const massType = document.getElementById("massType");

const remark = document.getElementById("remark");

const celebrated = document.getElementById("celebrated");

let selectedMonth = "";

months.forEach(card => {

    card.addEventListener("click", () => {

        selectedMonth = card.innerText;

        document.getElementById("modalTitle").innerHTML =
        `✝ ${selectedMonth} 2026`;

        modal.style.display = "flex";

    });

});

closeModal.onclick=()=>{

modal.style.display="none";

}

cancelBtn.onclick=()=>{

modal.style.display="none";

}

window.onclick=(e)=>{

if(e.target===modal){

modal.style.display="none";

}

}

saveBtn.addEventListener("click", async () => {

    if (!massDate.value) {

        alert("Please select a date.");

        return;

    }

    saveBtn.disabled = true;

    saveBtn.innerText = "Saving...";

    try {

        await addDoc(

            collection(
    db,
    "users",
    auth.currentUser.uid,
    "entries"
),

         {
    year: "2026",
    month: selectedMonth,
    date: massDate.value,
    type: massType.value,
    remark: remark.value,
    celebrated: celebrated.checked,
    createdAt: serverTimestamp()
}   

        );

        alert("Mass Entry Saved Successfully!");

        modal.style.display = "none";

        massDate.value = "";

        massType.selectedIndex = 0;

        remark.value = "";

        celebrated.checked = false;

    }

    catch(error){

        alert(error.message);

    }

    saveBtn.disabled = false;

    saveBtn.innerText = "Save";

});