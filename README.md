# comp586app-



frontend commands

command for node modules- npm install. (node modules need to be installed using node-js)
to start the app- npm start

to start the Back end- you will need flask libraries (flask is used instead of entity framework)

commands to install flask -

  pip3 install --user flask
  pip3 install --user flask-login
  pip3 install --user flask-sqlalchemy
  pip3 install --user flask-cors
  



The backend description 


Backend

We have 3 files in this:
1. app.py (main program) -> consists of routes that defines the rest calls and its URL
2. models.py -> consists of database tables and its schema
3. controller -> logic for what is to be done for each route and interacts with the database


app.py
--------------
Init

db = SQLAlchemy() 		## init of db 
app = Flask(__name__)	## creates flask app object

def create_app():    	## creates db and flask app init
    db.init_app(app)
    with app.test_request_context():
        db.create_all()
    return app



-> CORS (imp) - Cross-Origin Resource Sharing
------------
Why do we need it?
We are receiving request from localhost:3000 and sending a request to localhost:5000
They both do not match (Cross origin or different origin) and hence we need to allow Cross-Origin Resource Sharing

cors = CORS(app, resources={r"/login": {"origins": "*"}, r"/submit-feedback": {"origins": "*"}, r"/fetch-summary": {"origins": "*"}})

Here we have added URLs of all the rest calls and allow origin = "*" (all orifin) to call that url


-> Routes
-----------
each route has a url that the frontend makes a call to and it has a function to carry out the task





models.py
------------
Database schema




controller.py
-------------
database interaction for each of the function

1. login: we take the email id and check if that is already existing
if email id exists -> return the user_id from database
if does not exist -> add new User in database and return the corresponding user_id


2. submit rating: add a row to Ratings table
if rating = 0, means unrated, pass rating = Null or None
simple, no smartness in this


3. get avg:
Read all rows, calculate the total number of non null entries (actually rated entires) and sum of those entries for each of the 5 rating columns
avg = sum_r1/n_r1
return avg_rating[1-5] and (number of rows = number of reviews)









frontend description

Frontend

React:
state -> private local variable
renders DOM inside the page

The constructor resets the state to a fresh state
constructor() {
	super();
	this.state = {
		userDetails: {},
		uid: {},
		isUserLoggedIn: false,
		feedbackSubmitted: false,
		rating1: 0,
		rating2: 0,
		rating3: 0,
		rating4: 0,
		rating5: 0,
		num_reviews: 0
	};
}


Used oauth google login from the following references
1. https://www.npmjs.com/package/react-google-login
2. https://github.com/anthonyjgrove/react-google-login

on successful login:
we change the state, isUserLoggedIn: true
and then we send a POST request to backend to register the user by sending the 'email id' and 'Name'

registerUser = response => {
	this.setState({ userDetails: response.profileObj, isUserLoggedIn: true, feedbackSubmitted: false });

	** This is the rest call to backend **
	fetch('http://localhost:5000/login', {
		method: 'POST',
		headers: {
			Accept: 'application/json', ** We are receiving a json **
			'Content-Type': 'application/json', ** We are sending a json **
		},
		** Making a json object and sending it in body **
		body: JSON.stringify({
			email_id: response.profileObj.email,
			name: response.profileObj.givenName
		})
	}).then((response) => response.json()) ** Response from backend is received and converted to json **
	  .then((responseJson) => this.setState({ uid: responseJson.user_id })) ** We receive the user id of the the registered user from the database and we save it in the state for later use **
};


Now since the state is updated to isUserLoggedIn: true and feedbackSubmitted: false (Refer line number 34 in this document), we reload the DOM and update the page to have a logout button and add rating options to give the feedback
all ratings are set to 0 by default
on click of each rating calls a function to update the state 

onStarClickRating1(nextValue, prevValue, name) {
	console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
	this.setState({rating1: nextValue}); ** updates the rating **
}


On submit button click, we call the POST function from the backend to submit the feedback where it adds the entry to database
If the user has not rated for a particular question (rating = 0), we put a null entry in database and that entry is not counted for the calculation of avg
after the rest call, we update the state to feedbackSubmitted: true

fetch('http://localhost:5000/submit-feedback', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        rating1: this.state.rating1,
        rating2: this.state.rating2,
        rating3: this.state.rating3,
        rating4: this.state.rating4,
        rating5: this.state.rating5,
        uid: this.state.uid ** USER ID **
    })
})

this.setState({feedbackSubmitted: true})

We now call the other GET api after this to fetch the avg ratings and set the values in the state

fetch('http://localhost:5000/fetch-summary', {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
}).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson)
    this.setState({
        num_reviews: responseJson.num_reviews,
        rating1: responseJson.r1,
        rating2: responseJson.r2,
        rating3: responseJson.r3,
        rating4: responseJson.r4,
        rating5: responseJson.r5
    })
  })
}





Run Frontend:
cd feedback-frontend-react
npm install
npm start
