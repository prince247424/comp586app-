import React from 'react'
import ReactDOM, { render } from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


export { default } from './google-login'
export { default as GoogleLogin } from './google-login'
export { default as GoogleLogout } from './google-logout'

const renderApp = Component => {
  const app = document.getElementById('root')

  render(<Component />, app)
}

renderApp(App)

if (module.hot) {
  module.hot.accept('./App.js', () => {
    /* eslint-disable global-require */
    const app = require('./App.js').default
    renderApp(app)
  })
}
