from flask import Flask, jsonify, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import controller

db = SQLAlchemy()
app = Flask(__name__)

def create_app():    
    db.init_app(app)
    with app.test_request_context():
        db.create_all()
    return app

RESPONSE_SUCCESS = {'response': 200}
RESPONSE_INTERNAL_ERROR = {'response': 500}

cors = CORS(app, resources={r"/login": {"origins": "*"}, r"/submit-feedback": {"origins": "*"}, r"/fetch-summary": {"origins": "*"}})

@app.route('/')
def index():
    return jsonify("appfeedback")


@app.route('/login', methods=['POST'])
def login():
    if request.json:
        uid = controller.login_success(request.json['email_id'], request.json['name'])
        response = jsonify({'user_id' : uid, 'response': 200})
    else:
        response = jsonify(RESPONSE_INTERNAL_ERROR)
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response


@app.route('/submit-feedback', methods=['POST'])
def submitFeedback():
    if request.json:
        data = request.json
        controller.submit_new_rating(data['uid'], data['rating1'], data['rating2'], data['rating3'], data['rating4'], data['rating5'])
        response = jsonify(RESPONSE_SUCCESS)
    else:
        response = jsonify(RESPONSE_INTERNAL_ERROR)
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response


@app.route('/fetch-summary', methods=['GET'])
def fetchSummary():
	return controller.get_average_ratings()


if __name__ == '__main__':
    create_app()
    app.run(debug=True)