from flask import Flask, jsonify, redirect, request, redirect, url_for
import requests as http_request
import json
import utils.get_excel_volunteer as get_excel_volunteer
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config.from_pyfile('settings.py')


# Have problem with some api with the CORS, here is the solution
@app.route('/bypasscors')
def testcors():
    try:
        response = jsonify(json.loads(http_request.get(request.headers.get('url')).text))
    except:
        return redirect(url_for('error', code='cors-bridge-fail'))
    return response


@app.route('/')
def home():
    return {'hello': 'world'}


@app.route('/collaborators/<int:id>/enrolments')
def collaborator_enrolments(id):
    try:
        url = '{}admin/collaborators/{}/enrolments'.format(
            app.config.get('BEEPLE_URL'), id)
        headers = {'Token': app.config.get('BEEPLE_TOKEN')}
        response = http_request.get(url, headers=headers)

        jResponseEnrolments = json.loads(response.text)['enrolments']
        jsonArray = []

        for e in jResponseEnrolments:
            detailUrl = '{}admin/collaborators/enrolments/{}'.format(
                app.config.get('BEEPLE_URL'), e['id'])
            detailResponse = http_request.get(detailUrl, headers=headers)
            jResponseDetail = json.loads(detailResponse.text)
            jsonArray.append({
                'id': e['id'],
                'team': jResponseDetail['team'],
            })
    except:
        return redirect(url_for('error', code='enrolments-get-fail'))

    return jsonify(jsonArray)


@app.route('/auth', methods=['POST'])
def authentification():
    try:
        body = json.loads(request.data)
    except:
        return redirect(url_for('error', code='auth-bad-body'))
    url = '{}authenticate'.format(app.config.get('BEEPLE_URL'))
    response = http_request.post(url, json=body)

    try:
        jResponse = json.loads(response.text)
    except:
        return redirect(url_for('error', code='auth-bad-authentification'))

    if 'errors' in jResponse:
        return redirect(url_for('error', code='auth-bad-combination'))

    volunteers_data = get_excel_volunteer.get()
    volunteer = None

    for e in volunteers_data:
        if e['email'] == jResponse['email']:
            volunteer = e
            break

    if volunteer is not None:
        return {
            'id': volunteer['id'],
            'email': volunteer['email'],
            'token': jResponse['token']
        }
    else:
        return redirect(url_for('error', code='auth-bad-not-in-file'))


@app.route('/error/<code>')
def error(code):
    return {'error': {'code': code}}, 400

