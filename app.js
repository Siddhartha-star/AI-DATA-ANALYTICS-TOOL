document.addEventListener('DOMContentLoaded', () => {
    // File upload elements
    const fileUpload = document.getElementById('fileUpload');
    const fileUploadLabel = document.getElementById('fileUploadLabel');
    const uploadStatus = document.getElementById('uploadStatus');

    // Clean elements
    const cleanCard = document.getElementById('cleanCard');
    const cleanBtn = document.getElementById('cleanBtn');
    const cleanStatus = document.getElementById('cleanStatus');

    // Chat/Query elements
    const chatCard = document.getElementById('chatCard');
    const queryInput = document.getElementById('queryInput');
    const submitQueryBtn = document.getElementById('submitQueryBtn');
    const analysisStatus = document.getElementById('analysisStatus');

    // Results elements
    const resultsSection = document.getElementById('resultsSection');
    const outputDiv = document.getElementById('output');
    const downloadBtn = document.getElementById('downloadBtn');

    let uploadedFile = null;
    let latestResult = "";

    // --- Utility Functions for UI Updates ---
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
                // Keep completed steps active but not primary
                stepNumber.classList.replace('bg-indigo-500', 'bg-green-500');

            }
        });
    };


    // --- File Upload Logic ---
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
        
        // Simulate a backend call for preview
        setTimeout(() => {
            // This is where you would normally have a fetch call to your backend
            // For this demo, we'll simulate a successful response
            const simulatedData = {
                rows: 150,
                columns: 5,
                preview: "col1,col2,col3,col4,col5\nval1,val2,val3,val4,val5\nval1,val2,val3,val4,val5"
            };
            
            showSuccess(uploadStatus, 'File uploaded and preview generated!');
            uploadStatus.innerHTML += `
                <div class="mt-4 p-4 bg-gray-900 text-left rounded-lg fade-in">
                    <p><strong>Rows:</strong> ${simulatedData.rows}</p>
                    <p><strong>Columns:</strong> ${simulatedData.columns}</p>
                    <pre class="mt-2 p-2 bg-black text-gray-300 rounded text-xs">${simulatedData.preview}</pre>
                </div>
            `;
            activateCard('cleanCard');
        }, 1500); // Simulate network delay
    }

    // --- Data Cleaning Logic ---
    cleanBtn.addEventListener('click', () => {
        if (!uploadedFile) return;
        showLoader(cleanStatus, 'Cleaning data...');

        // Simulate backend cleaning process
        setTimeout(() => {
            showSuccess(cleanStatus, 'Data cleaned successfully!');
            activateCard('chatCard');
        }, 2000);
    });

    // --- Query Submission Logic ---
    submitQueryBtn.addEventListener('click', () => {
        const query = queryInput.value.trim();
        if (!query) {
            showError(analysisStatus, 'Please enter a query.');
            return;
        }

        showLoader(analysisStatus, 'Analyzing your query...');
        resultsSection.classList.add('hidden');
        outputDiv.innerHTML = '';
        downloadBtn.classList.add('hidden');

        // Simulate backend query analysis
        setTimeout(() => {
            showSuccess(analysisStatus, 'Analysis complete!');
            
            // Simulated result and chart
            latestResult = "Top 5 Products by Sales:\n1. Product A - $50,000\n2. Product C - $45,000\n3. Product B - $30,000\n4. Product E - $25,000\n5. Product D - $20,000";
            
            const resultHtml = `
                <div class="bg-gray-900 p-4 rounded-lg">
                    <h3 class="font-semibold text-lg mb-2 text-indigo-300">Textual Analysis:</h3>
                    <pre class="whitespace-pre-wrap text-gray-300">${latestResult}</pre>
                </div>`;
            
            const chartHtml = `<div id="chartDiv" class="bg-gray-900 p-4 rounded-lg"></div>`;
            
            outputDiv.innerHTML = resultHtml + chartHtml;
            resultsSection.classList.remove('hidden');

            // Render Plotly chart
            const plotData = [{
                x: ['Product A', 'Product C', 'Product B', 'Product E', 'Product D'],
                y: [50000, 45000, 30000, 25000, 20000],
                type: 'bar',
                marker: { color: '#4f46e5' }
            }];
            const layout = {
                title: 'Top 5 Products by Sales',
                paper_bgcolor: '#242731',
                plot_bgcolor: '#242731',
                font: { color: '#e5e7eb' },
                xaxis: { gridcolor: '#374151' },
                yaxis: { gridcolor: '#374151' }
            };
            Plotly.newPlot('chartDiv', plotData, layout, {responsive: true});

            downloadBtn.classList.remove('hidden');
        }, 2500);
    });

    // --- Download Logic ---
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
