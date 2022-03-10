from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)
app.config.from_pyfile('settings.py')

@app.route("/")
def hello_world():
    file = pd.read_excel(app.config.get("EXCEL_URL"))
    jsonArray = []

    for r in file.iloc:
        jsonArray.append({
            "id": int(r['Code Beeple']),
            "email": r['e-mail'],
        })
    return jsonify(jsonArray)
