import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Pers from './redux/store/store'
import { PersistGate } from 'redux-persist/integration/react'


ReactDOM.render(
    <Provider store={Pers.store}>
    <PersistGate loading={null} persistor={Pers.persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </PersistGate>
    </Provider>
,
  document.getElementById('root')
)
