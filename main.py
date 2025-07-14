from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import io
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "uploaded_data.csv"

@app.route("/")
def index():
    return "✅ InsightFlow AI Backend with Together API is Running"

@app.route("/preview", methods=["POST"])
def preview_data():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    df = pd.read_csv(file)
    df.to_csv(DATA_FILE, index=False)

    preview_text = df.head().to_string()
    return jsonify({
        "preview": preview_text,
        "rows": df.shape[0],
        "columns": df.shape[1]
    })

@app.route("/clean", methods=["POST"])
def clean_data():
    if not os.path.exists(DATA_FILE):
        return jsonify({"error": "No uploaded file found"}), 400

    df = pd.read_csv(DATA_FILE)
    df.fillna("NaN", inplace=True)
    df.to_csv(DATA_FILE, index=False)

    return jsonify({"message": "Missing data filled successfully!"})

@app.route("/query", methods=["POST"])
def handle_query():
    data = request.json
    query = data.get("query", "")

    # Dummy response for testing (replace with LLM logic)
    response_text = f"Your query was: '{query}'."
    dummy_chart = {
        "title": "Dummy Bar Chart",
        "data": [{
            "x": ["A", "B", "C"],
            "y": [10, 20, 15],
            "type": "bar"
        }],
        "layout": {
            "title": "Dummy Chart Example"
        }
    }

    return jsonify({
        "text": response_text,
        "chart": dummy_chart
    })

@app.route("/download", methods=["GET"])
def download_file():
    if not os.path.exists(DATA_FILE):
        return "File not found", 404
    return send_file(DATA_FILE, as_attachment=True)
