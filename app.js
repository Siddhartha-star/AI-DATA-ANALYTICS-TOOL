const BASE_URL = "https://ai-data-analytics-tool.onrender.com";

// Sidebar Toggle
document.getElementById("sidebar-toggle").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const logo = document.getElementById("sidebar-logo");
    const texts = document.querySelectorAll(".sidebar-link-text, #user-info");
    sidebar.classList.toggle("w-64");
    logo.classList.toggle("opacity-0");
    texts.forEach(el => el.classList.toggle("opacity-0"));
});

// Navigation
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active-link"));
        link.classList.add("active-link");

        document.querySelectorAll(".page-content").forEach(page => page.classList.add("hidden"));
        const pageId = link.getAttribute("data-page");
        document.getElementById(pageId).classList.remove("hidden");
    });
});

// File Upload
const fileUpload = document.getElementById("fileUpload");
const fileLabel = document.getElementById("fileUploadLabel");
const uploadStatus = document.getElementById("uploadStatus");
const cleanCard = document.getElementById("cleanCard");
const chatCard = document.getElementById("chatCard");

fileLabel.addEventListener("dragover", e => {
    e.preventDefault();
    fileLabel.classList.add("dragover");
});
fileLabel.addEventListener("dragleave", () => fileLabel.classList.remove("dragover"));
fileLabel.addEventListener("drop", e => {
    e.preventDefault();
    fileUpload.files = e.dataTransfer.files;
    fileLabel.classList.remove("dragover");
    handleFileUpload();
});
fileUpload.addEventListener("change", handleFileUpload);

function handleFileUpload() {
    const file = fileUpload.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    uploadStatus.innerHTML = `<div class="loader mx-auto my-4"></div>`;

    fetch(`${BASE_URL}/preview`, {
        method: "POST",
        body: formData,
    })
    .then(res => res.json())
    .then(data => {
        uploadStatus.innerHTML = `<p class="text-green-400 font-semibold">File uploaded and preview generated!</p>
        <p class="text-sm text-gray-400">Rows: ${data.rows}</p>
        <p class="text-sm text-gray-400 mb-2">Columns: ${data.columns}</p>
        <pre class="text-sm bg-gray-900 p-3 rounded-md mt-2 overflow-auto max-h-48">${data.preview}</pre>`;
        cleanCard.classList.remove("opacity-50", "pointer-events-none");
    })
    .catch(() => {
        uploadStatus.innerHTML = `<p class="text-red-500 font-semibold">Upload failed. Try again.</p>`;
    });
}

// Auto Clean
document.getElementById("cleanBtn").addEventListener("click", () => {
    const cleanStatus = document.getElementById("cleanStatus");
    cleanStatus.innerHTML = `<div class="loader mx-auto my-4"></div>`;

    fetch(`${BASE_URL}/clean`, { method: "POST" })
    .then(res => res.json())
    .then(data => {
        cleanStatus.innerHTML = `<p class="text-green-400 font-semibold">${data.message}</p>`;
        chatCard.classList.remove("opacity-50", "pointer-events-none");
    })
    .catch(() => {
        cleanStatus.innerHTML = `<p class="text-red-500 font-semibold">Auto clean failed. Try again.</p>`;
    });
});

// Submit Query
document.getElementById("submitQueryBtn").addEventListener("click", () => {
    const input = document.getElementById("queryInput").value.trim();
    const analysisStatus = document.getElementById("analysisStatus");
    const output = document.getElementById("output");
    const textResult = document.getElementById("textResult");
    const chartResult = document.getElementById("chartResult");
    const chartTitle = document.getElementById("chartTitle");

    if (!input) return alert("Enter a query!");

    analysisStatus.innerHTML = `<div class="loader mx-auto my-4"></div>`;

    fetch(`${BASE_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input })
    })
    .then(res => res.json())
    .then(data => {
        analysisStatus.innerHTML = "";
        document.getElementById("resultsSection").classList.remove("hidden");
        textResult.innerText = data.text;

        if (data.chart) {
            chartTitle.innerText = data.chart.title;
            Plotly.newPlot("chartResult", data.chart.data, data.chart.layout);
        } else {
            chartTitle.innerText = "";
            chartResult.innerHTML = "<p class='text-gray-400'>No chart available for this query.</p>";
        }

        document.getElementById("downloadBtn").classList.remove("hidden");
    })
    .catch(() => {
        analysisStatus.innerHTML = `<p class="text-red-500 font-semibold">Query failed. Try again.</p>`;
    });
});

// Download
document.getElementById("downloadBtn").addEventListener("click", () => {
    window.open(`${BASE_URL}/download`, "_blank");
});
