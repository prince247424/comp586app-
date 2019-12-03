import React, { useState } from 'react'
import logo from './logo.svg';
import './App.css';
import { GoogleLogout, GoogleLogin } from './index'
import StarRatingComponent from 'react-star-rating-component'


const clientId = '837403820697-elnn0ltm7irslo97os1oooiqsep243p8.apps.googleusercontent.com'
class App extends React.Component {
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

  failureResponseGoogle = response => {
    this.setState({ userDetails: response.profileObj, isUserLoggedIn: false });
  };

  logout = () => {
    this.setState({
        isUserLoggedIn: false,
        uid : {}, feedbackSubmitted: false,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0,
        rating5: 0
    })
  };

  registerUser = response => {
    this.setState({ userDetails: response.profileObj, isUserLoggedIn: true, feedbackSubmitted: false });
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email_id: response.profileObj.email,
            name: response.profileObj.givenName
        })
    }).then((response) => response.json())
      .then((responseJson) => this.setState({ uid: responseJson.user_id }))
  };

  onStarClickRating1(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({rating1: nextValue});
  }

  onStarClickRating2(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({rating2: nextValue});
  }

  onStarClickRating3(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({rating3: nextValue});
  }

  onStarClickRating4(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({rating4: nextValue});
  }

  onStarClickRating5(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({rating5: nextValue});
  }

  submitFeedback = () => {
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
            uid: this.state.uid
        })
    })
  	this.setState({feedbackSubmitted: true})

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


  render(){
    return ( 

      <div className="App">
        {!this.state.isUserLoggedIn && (
          <GoogleLogin
            clientId={clientId}
            render={renderProps => (
              <button
                className="button"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Log in with Google
              </button>
            )}
            onSuccess={this.registerUser}
            onFailure={this.failureResponseGoogle}
          />

        )}


<h2>  Welcome to the rating app </h2 > 
<h3> Instructions </h3>
<h5> Average rating will be calculated once you submit your rating</h5>
<h5> The average rating is calculated based on over all ratings </h5>

        {this.state.isUserLoggedIn && !this.state.feedbackSubmitted && (
          <div className="userDetails-wrapper">
            <div className="details-wrapper">
              <GoogleLogout
                id="logout-button"
                render={renderProps => (
                  <button
                    className="logout-button"
                    onClick={renderProps.onClick}
                  >
                    Log Out
                  </button>
                )}
                onLogoutSuccess={this.logout}
              />

              <div className="name">
                Welcome {this.state.userDetails.givenName}{" "}
                {this.state.userDetails.familyName}
              </div>
              <div className="email"><i>{this.state.userDetails.email}</i></div>
            </div>
            <div className="bar" />
            <div className="stand" />

            <h3>Rating 1</h3>
            <div style={{fontSize: 26}}>
              <StarRatingComponent
                name="rating1"
                value={this.state.rating1}
                onStarClick={this.onStarClickRating1.bind(this)} />
            </div>

            <h3>Rating 2</h3>
            <div style={{fontSize: 26}}>
              <StarRatingComponent
                name="rating2"
                value={this.state.rating2}
                onStarClick={this.onStarClickRating2.bind(this)} />
            </div>

	        <h3>Rating 3</h3>
	        <div style={{fontSize: 26}}>
	          <StarRatingComponent
	            name="rating3"
	            value={this.state.rating3}
	            onStarClick={this.onStarClickRating3.bind(this)} />
	        </div>

	        <h3>Rating 4</h3>
	        <div style={{fontSize: 26}}>
	          <StarRatingComponent
	            name="rating4"
	            value={this.state.rating4}
	            onStarClick={this.onStarClickRating4.bind(this)} />
	        </div>

	        <h3>Rating 5</h3>
	        <div style={{fontSize: 26}}>
	          <StarRatingComponent
	            name="rating5"
	            value={this.state.rating5}
	            onStarClick={this.onStarClickRating5.bind(this)} />
	        </div>
	        
	        <button className="submit-button" onClick={this.submitFeedback}> Submit </button>

          </div>
        )}
        {this.state.isUserLoggedIn && this.state.feedbackSubmitted && (
          <div className="userDetails-wrapper">
            <div className="details-wrapper">
              <GoogleLogout
                id="logout-button"
                render={renderProps => (
                  <button
                    className="logout-button"
                    onClick={renderProps.onClick}
                  >
                    Log Out
                  </button>
                )}
                onLogoutSuccess={this.logout}
              />

              <div className="name">
                Welcome {this.state.userDetails.givenName}{" "}
                {this.state.userDetails.familyName}
              </div>
              <div className="email"><i>{this.state.userDetails.email}</i></div>
            </div>
            <div className="bar" />
            <div className="stand" />

            <h2>Average ratings based on {this.state.num_reviews} reviews</h2>

            <h3>Rating 1</h3>
            <div style={{fontSize: 26}}>
              <StarRatingComponent
                name="rating1"
                value={this.state.rating1} />
            </div>

            <h3>Rating 2</h3>
            <div style={{fontSize: 26}}>
              <StarRatingComponent
                name="rating2"
                value={this.state.rating2} />
            </div>

            <h3>Rating 3</h3>
            <div style={{fontSize: 26}}>
              <StarRatingComponent
                name="rating3"
                value={this.state.rating3} />
            </div>

            <h3>Rating 4</h3>
            <div style={{fontSize: 26}}>
              <StarRatingComponent
                name="rating4"
                value={this.state.rating4} />
            </div>

            <h3>Rating 5</h3>
            <div style={{fontSize: 26}}>
              <StarRatingComponent
                name="rating5"
                value={this.state.rating5} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
// const success = response => {
//   console.log(response) // eslint-disable-line
// }

// const error = response => {
//   console.error(response) // eslint-disable-line
// }

// const loading = () => {
//   console.log('loading') // eslint-disable-line
// }

// const logout = () => {
//   console.log('logout') // eslint-disable-line
// }

// const MountTest = () => {
//   const [showButton, toggleShow] = useState(true)

//   if (showButton) {
//     return (
//       <GoogleLogin
//         onSuccess={res => {
//           toggleShow(false)
//           success(res)

//         }}
//         onFailure={error}
//         clientId={clientId}
//       >
//         Auth then Hide button
//       </GoogleLogin>
//     )
//   } else {
//       <GoogleLogout
//         clientId={clientId}
//         buttonText="Logout"
//         onLogoutSuccess={logout}
//       >
//       </GoogleLogout>
//   }

//   return <button onClick={() => toggleShow(true)}>show button</button>
// }

// export default () => (
//   <div>
//     <br />
//     <GoogleLogin 
//       clientId={clientId} 
//       onSuccess={success}
//       onFailure={error}
//       onRequest={loading}
//       offline={false}
//       approvalPrompt="force"
//       responseType="id_token"
//       isSignedIn
//       theme="dark"
//       style={{ background: 'blue' }}/>
//     <br />
//     <br />
//     <GoogleLogout id="logout-button" theme="dark" buttonText="Logout" onLogoutSuccess={logout} />
//   </div>
// )



export default App;
