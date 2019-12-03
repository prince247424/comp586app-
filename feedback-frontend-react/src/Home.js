import React, { useState } from 'react'
import logo from './logo.svg';
import './App.css';
import { GoogleLogout, GoogleLogin } from './index'


const clientId = '837403820697-elnn0ltm7irslo97os1oooiqsep243p8.apps.googleusercontent.com'
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userDetails: {},
      isUserLoggedIn: false
    };
  }

  responseGoogle = response => {
    this.setState({ userDetails: response.profileObj, isUserLoggedIn: true });
  };

  logout = () => {
    this.setState({isUserLoggedIn: false})
  };

  registerUser = response => {
    // alert(JSON.stringify({
    //     email_id: response.profileObj.email,
    //     name: response.profileObj.givenName
    // }))
//     fetch('http://localhost:5000/login', {
//   method: 'POST',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
// 	"name": "pratik"
// })
// });
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
    })
    .then((res) => {
    	console.log(res)
})
.catch((error) => {
  console.error(error)
});
  };


  render() {
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
            onSuccess={this.responseGoogle, this.registerUser}
            onFailure={this.responseGoogle}
          />
        )}
        {this.state.isUserLoggedIn && (
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
