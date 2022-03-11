from flask import Flask
import pandas as pd

app = Flask(__name__)
app.config.from_pyfile('../settings.py')

def get():
    file = pd.read_excel(app.config.get('EXCEL_URL'))
    jsonArray = []

    for r in file.iloc:
        # The id is (for the moment...) always 1100 minder than the code beepl
        # Dont ask me why please, Beeple is Beeple...
        jsonArray.append({
            'id': int(r['Code Beeple']) - 1100,
            'email': r['e-mail'],
        })
    return jsonArray