
document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = "https://ai-data-analytics-tool.onrender.com";

    const fileUpload = document.getElementById('fileUpload');
    const fileUploadLabel = document.getElementById('fileUploadLabel');
    const uploadStatus = document.getElementById('uploadStatus');
    const cleanBtn = document.getElementById('cleanBtn');
    const cleanStatus = document.getElementById('cleanStatus');
    const queryInput = document.getElementById('queryInput');
    const submitQueryBtn = document.getElementById('submitQueryBtn');
    const analysisStatus = document.getElementById('analysisStatus');
    const resultsSection = document.getElementById('resultsSection');
    const outputDiv = document.getElementById('output');
    const downloadBtn = document.getElementById('downloadBtn');

    let uploadedFile = null;
    let latestResult = "";

    const showLoader = (element, message) => {
        element.innerHTML = `<div class="text-yellow-400">${message}</div>`;
    };

    const showSuccess = (element, message) => {
        element.innerHTML = `<div class="text-green-400">${message}</div>`;
    };

    const showError = (element, message) => {
        element.innerHTML = `<div class="text-red-400">${message}</div>`;
    };

    const activateCard = (cardId) => {
        const cards = ['uploadCard', 'cleanCard', 'chatCard'];
        cards.forEach(id => {
            const card = document.getElementById(id);
            const stepNumber = card.querySelector('.font-bold');
            if (id === cardId) {
                card.classList.add('active');
                stepNumber.classList.replace('bg-gray-600', 'bg-indigo-500');
            } else {
                stepNumber.classList.replace('bg-indigo-500', 'bg-green-500');
            }
        });
    };

    fileUpload.addEventListener('change', handleFileUpload);

    function handleFileUpload() {
        uploadedFile = fileUpload.files[0];
        if (!uploadedFile) return;

        showLoader(uploadStatus, `Uploading ${uploadedFile.name}...`);
        const formData = new FormData();
        formData.append("file", uploadedFile);

        fetch(`${BASE_URL}/preview`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            showSuccess(uploadStatus, 'File uploaded and preview generated!');
            uploadStatus.innerHTML += `
                <div class="mt-4 p-4 bg-gray-900 text-left rounded-lg fade-in">
                    <p><strong>Rows:</strong> ${data.rows}</p>
                    <p><strong>Columns:</strong> ${data.columns}</p>
                    <pre class="mt-2 p-2 bg-black text-gray-300 rounded text-xs">${data.preview}</pre>
                </div>
            `;
            activateCard('cleanCard');
        })
        .catch(() => showError(uploadStatus, 'Failed to upload file.'));
    }

    cleanBtn.addEventListener('click', () => {
        if (!uploadedFile) return;
        showLoader(cleanStatus, 'Cleaning data...');
        const formData = new FormData();
        formData.append("file", uploadedFile);

        fetch(`${BASE_URL}/clean`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            showSuccess(cleanStatus, data.message || 'Data cleaned successfully!');
            activateCard('chatCard');
        })
        .catch(() => showError(cleanStatus, 'Failed to clean data.'));
    });

    submitQueryBtn.addEventListener('click', () => {
        const query = queryInput.value.trim();
        if (!query || !uploadedFile) {
            showError(analysisStatus, 'Please upload a file and enter a query.');
            return;
        }

        showLoader(analysisStatus, 'Analyzing your query...');
        resultsSection.classList.add('hidden');
        outputDiv.innerHTML = '';
        downloadBtn.classList.add('hidden');

        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("query", query);

        fetch(`${BASE_URL}/query`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            showSuccess(analysisStatus, 'Analysis complete!');
            latestResult = data.result;

            const resultHtml = `
                <div class="bg-gray-900 p-4 rounded-lg">
                    <h3 class="font-semibold text-lg mb-2 text-indigo-300">Textual Analysis:</h3>
                    <pre class="whitespace-pre-wrap text-gray-300">${latestResult}</pre>
                </div>`;

            const chartHtml = data.chart ? `<div id="chartDiv" class="bg-gray-900 p-4 rounded-lg">${data.chart}</div>` : "";

            outputDiv.innerHTML = resultHtml + chartHtml;
            resultsSection.classList.remove('hidden');
            downloadBtn.classList.remove('hidden');
        })
        .catch(() => showError(analysisStatus, 'Failed to analyze the query.'));
    });

    downloadBtn.addEventListener('click', () => {
        if (!latestResult) return;
        const blob = new Blob([latestResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'krishna_ai_analysis.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
