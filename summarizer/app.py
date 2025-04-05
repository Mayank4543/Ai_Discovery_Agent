from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("text", "")
    summary = summarizer(text, max_length=60, min_length=20, do_sample=False)
    return jsonify({"summary": summary[0]["summary_text"]})

app.run(port=5000)
