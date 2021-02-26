import React from 'react'
import './assets/app.scss'
import './assets/darkmode.scss'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './containers/App'
import configureStore from './models/store/configureStore'


const store = configureStore()
window.pngCache = {}

render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </Provider>
  , document.querySelector('#root')
)


