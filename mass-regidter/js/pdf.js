import {
    auth,
    db,
    doc,
    getDoc
} from "./firebase.js";

const pdfMonth = document.getElementById("pdfMonth");

const pdfYear = document.getElementById("pdfYear");

const exportPdfBtn = document.getElementById("exportPdfBtn");

const pdfModal = document.getElementById("pdfModal");

const closePdfModal = document.getElementById("closePdfModal");

const cancelPdfBtn = document.getElementById("cancelPdfBtn");

const yearSelect = document.getElementById("yearSelect");

const reportType = document.getElementById("reportType");
const monthGroup = document.getElementById("monthGroup");

const generatePdfBtn = document.getElementById("generatePdfBtn");

generatePdfBtn.addEventListener("click", async () => {

    generatePdfBtn.disabled = true;

    generatePdfBtn.innerText = "Generating...";

    try{

        const { jsPDF } = window.jspdf;

        const user = auth.currentUser;

const userSnap = await getDoc(
    doc(db, "users", user.uid)
);

const profile = userSnap.data();

        const pdf = new jsPDF();

        // Title
pdf.setFontSize(22);
pdf.text("✝ MASS REGISTER",105,20,{align:"center"});

// Parish
pdf.setFontSize(16);
pdf.text(profile.parish || "",105,32,{align:"center"});

// Diocese
pdf.setFontSize(13);
pdf.text(profile.diocese || "",105,40,{align:"center"});

// Line
pdf.line(20,52,190,52);

// Report
pdf.setFontSize(14);
pdf.text("Monthly Report",20,60);

pdf.setFontSize(12);
pdf.text(`Month : ${pdfMonth.value}`,20,70);

pdf.text(`Year : ${pdfYear.value}`,20,78);

        pdf.save("Mass-Register.pdf");

    }

    catch(error){

        alert(error.message);

    }

    generatePdfBtn.disabled = false;

    generatePdfBtn.innerText = "Export PDF";

});

reportType.addEventListener("change", () => {

    if (reportType.value === "yearly") {

        monthGroup.style.display = "none";

    } else {

        monthGroup.style.display = "block";

    }

});

exportPdfBtn.addEventListener("click", () => {

    pdfYear.innerHTML = yearSelect.innerHTML;

    pdfYear.value = yearSelect.value;

    pdfModal.style.display = "flex";

});

closePdfModal.onclick = () => {

    pdfModal.style.display = "none";

};

cancelPdfBtn.onclick = () => {

    pdfModal.style.display = "none";

};

window.addEventListener("click", (e) => {

    if (e.target === pdfModal) {

        pdfModal.style.display = "none";

    }

});