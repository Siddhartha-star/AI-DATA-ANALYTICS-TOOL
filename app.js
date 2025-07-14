document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('fileUpload');
    const fileUploadLabel = document.getElementById('fileUploadLabel');
    const uploadStatus = document.getElementById('uploadStatus');
    const cleanBtn = document.getElementById('cleanBtn');
    const cleanStatus = document.getElementById('cleanStatus');
    const queryInput = document.getElementById('queryInput');
    const submitQueryBtn = document.getElementById('submitQueryBtn');
    const analysisStatus = document.getElementById('analysisStatus');
    const resultsSection = document.getElementById('resultsSection');
    const textResult = document.getElementById('textResult');
    const chartResult = document.getElementById('chartResult');
    const downloadBtn = document.getElementById('downloadBtn');

    let uploadedFile = null;
    let latestResult = "";

    const showLoader = (element, message) => {
        element.innerHTML = `
            <div class="flex items-center justify-center text-yellow-400">
                <div class="loader mr-3" style="width: 20px; height: 20px; border-width: 2px;"></div>
                <span>${message}</span>
            </div>`;
    };

    const showSuccess = (element, message) => {
        element.innerHTML = `
            <div class="flex items-center justify-center text-green-400 fade-in">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>`;
    };

    const showError = (element, message) => {
        element.innerHTML = `
            <div class="flex items-center justify-center text-red-400 fade-in">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
            </div>`;
    };

    const activateCard = (cardId) => {
        const cards = ['uploadCard', 'cleanCard', 'chatCard'];
        cards.forEach(id => {
            const card = document.getElementById(id);
            const stepNumber = card.querySelector('.font-bold');
            if (id === cardId) {
                card.classList.add('active');
                card.classList.remove('opacity-50', 'pointer-events-none');
                stepNumber.classList.replace('bg-gray-600', 'bg-indigo-500');
            } else if (card.classList.contains('active')) {
                stepNumber.classList.replace('bg-indigo-500', 'bg-green-500');
            }
        });
    };

    fileUploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadLabel.classList.add('dragover');
    });

    fileUploadLabel.addEventListener('dragleave', () => {
        fileUploadLabel.classList.remove('dragover');
    });

    fileUploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadLabel.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileUpload.files = files;
            handleFileUpload();
        }
    });

    fileUpload.addEventListener('change', handleFileUpload);

    function handleFileUpload() {
        uploadedFile = fileUpload.files[0];
        if (!uploadedFile) return;

        showLoader(uploadStatus, `Uploading ${uploadedFile.name}...`);

        const formData = new FormData();
        formData.append('file', uploadedFile);

        fetch('https://ai-data-analytics-tool.onrender.com/preview', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showError(uploadStatus, data.error);
                return;
            }

            showSuccess(uploadStatus, 'File uploaded and preview generated!');
            uploadStatus.innerHTML += `
                <div class="mt-4 p-4 bg-gray-900 text-left rounded-lg fade-in">
                    <p><strong>Rows:</strong> ${data.rows}</p>
                    <p><strong>Columns:</strong> ${data.columns}</p>
                    <pre class="mt-2 p-2 bg-black text-gray-300 rounded text-xs">${data.preview}</pre>
                </div>`;
            activateCard('cleanCard');
        })
        .catch(err => showError(uploadStatus, err.message));
    }

    cleanBtn.addEventListener('click', () => {
        if (!uploadedFile) return;
        showLoader(cleanStatus, 'Cleaning data...');

        const formData = new FormData();
        formData.append('file', uploadedFile);

        fetch('https://ai-data-analytics-tool.onrender.com/clean', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showError(cleanStatus, data.error);
                return;
            }

            showSuccess(cleanStatus, data.message);
            activateCard('chatCard');
        })
        .catch(err => showError(cleanStatus, err.message));
    });

    submitQueryBtn.addEventListener('click', () => {
        const query = queryInput.value.trim();
        if (!query || !uploadedFile) {
            showError(analysisStatus, 'Please upload a file and enter your query.');
            return;
        }

        showLoader(analysisStatus, 'Analyzing your query...');
        resultsSection.classList.add('hidden');
        textResult.innerHTML = '';
        chartResult.innerHTML = '';
        downloadBtn.classList.add('hidden');

        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('query', query);

        fetch('https://ai-data-analytics-tool.onrender.com/query', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showError(analysisStatus, data.error);
                return;
            }

            showSuccess(analysisStatus, 'Analysis complete!');
            latestResult = data.result;
            textResult.innerHTML = `<pre class="whitespace-pre-wrap text-gray-300">${data.result}</pre>`;
            if (data.chart) {
                chartResult.innerHTML = data.chart;
            }
            resultsSection.classList.remove('hidden');
            downloadBtn.classList.remove('hidden');
        })
        .catch(err => showError(analysisStatus, err.message));
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
