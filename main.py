from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import pandas as pd
import requests
import plotly.express as px

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
TOGETHER_MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1"

# ---------- ROUTE: Preview Data ----------
@app.route('/preview', methods=['POST'])
def preview():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"})
    df = pd.read_csv(file) if file.filename.endswith('.csv') else pd.read_excel(file)
    return jsonify({
        "rows": df.shape[0],
        "columns": df.shape[1],
        "preview": df.head().to_string(index=False)
    })

# ---------- ROUTE: Clean Data ----------
@app.route('/clean', methods=['POST'])
def clean():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file"})
    df = pd.read_csv(file) if file.filename.endswith('.csv') else pd.read_excel(file)
    cleaned = df.dropna()
    return jsonify({
        "message": f"Missing values removed. Cleaned data has {cleaned.shape[0]} rows and {cleaned.shape[1]} columns."
    })

# ---------- ROUTE: AI Analysis ----------
@app.route('/query', methods=['POST'])
def query_data():
    try:
        file = request.files.get("file")
        query = request.form.get("query")
        if not file or not query:
            return jsonify({"error": "Missing file or query"}), 400

        df = pd.read_csv(file) if file.filename.endswith('.csv') else pd.read_excel(file)
        preview_data = df.head(25).to_csv(index=False)

        prompt = f"""You are a data analyst. Analyze the following dataset preview and respond to the user's query.

User's Query: {query}

Data Preview:
{preview_data}
"""

        # Send to Together AI
        headers = {
            "Authorization": f"Bearer {TOGETHER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": TOGETHER_MODEL,
            "prompt": prompt,
            "max_tokens": 512,
            "temperature": 0.7,
            "top_p": 0.9,
            "stop": None
        }

        response = requests.post("https://api.together.xyz/v1/completions", json=payload, headers=headers)
        result = response.json()
        summary = result.get("choices", [{}])[0].get("text", "").strip()

        chart_html = None
        if "bar chart" in summary.lower() and len(df.columns) >= 2:
            fig = px.bar(df, x=df.columns[0], y=df.columns[1])
            chart_html = fig.to_html(full_html=False)
        elif "pie chart" in summary.lower() and len(df.columns) >= 2:
            fig = px.pie(df, names=df.columns[0], values=df.columns[1])
            chart_html = fig.to_html(full_html=False)
        elif "line chart" in summary.lower() and len(df.columns) >= 2:
            fig = px.line(df, x=df.columns[0], y=df.columns[1])
            chart_html = fig.to_html(full_html=False)

        return jsonify({"result": summary, "chart": chart_html})

    except Exception as e:
        print("[ERROR]", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "✅ Krishna AI Backend with Together API is Running"

if __name__ == '__main__':
    app.run(debug=True)
