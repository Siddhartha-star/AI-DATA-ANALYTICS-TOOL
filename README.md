# AI Data Analytics Tool

##  Project Structure

```
AI_Data_Analytics_Tool
├── frontend/
│ ├── index.html # Web interface (Tailwind CSS + JavaScript)
│ └── app.js # Handles UI logic, file upload, queries
├── backend/
│ ├── main.py # Flask server with routes for preview, clean, query
│ ├── requirements.txt # Python dependencies
│ └── .env # Secure environment for API key (excluded from repo)
```

##  How to Run in VS Code

### 
---

## 💻 How to Run Locally (VS Code)

###  1. Get the Project

- Clone or unzip the folder to your local system.

###  2. Set Up the Backend (Flask API)

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Add your Together AI key in a `.env` file:
echo Together_AI_API_KEY=your_api_key_here > .env

# Start the Flask server
python main.py
✅ Flask will be running on: http://localhost:5000
```



### 3. Run the Frontend


Navigate to the frontend/ folder.

Open index.html in your browser.

Or use Live Server in VS Code to open it automatically.

### 4. Explore & Analyze Data
Upload your .csv or .xlsx file

Preview number of rows/columns and top sample data

Clean missing values with a single click

You can ask questions like:
- "Show top 5 products by sales"
- "Give me average revenue by region"
- "Detect missing values or anomalies"

##  Key Features
✅ File upload (CSV & Excel supported)

✅ Automatic dataset preview

✅ Missing value cleaning

✅ Natural language questions using Together AI

✅ Visual output with bar, pie, and line charts

✅ Fully responsive Tailwind UI

✅ Modular structure (frontend + backend)

---
---

##  Tech Stack

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| Backend   | Python, Flask, Pandas, Plotly          |
| AI Engine | Together AI (Gemini API key)           |
| Frontend  | HTML, Tailwind CSS, JavaScript         |
| Visuals   | Plotly charts                          |
| Security  | `.env` file for secure API key storage |

---

 ## API Configuration
 Create a .env file inside the /backend directory with this:
 ```bash
 Together_AI_API_KEY=your_api_key_here
```

