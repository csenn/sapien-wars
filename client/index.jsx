import React from 'react'
import ReactDOM from 'react-dom'
import MapView from './mapView/MapView'
import store from './data/store'
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom'

import 'mapbox-gl/dist/mapbox-gl.css'

// <Link to='/'>Home</Link>
// <br />
// <Link to='/about'>About</Link>

const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what's the font-size on the html element is.
    fontFamily: 'Maven Pro'
  }
})

const app = (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route exact path='/' component={MapView} />
      </BrowserRouter>
    </MuiThemeProvider>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'))
