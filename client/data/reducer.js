import { combineReducers } from 'redux'
import mapViewReducer from '../mapView/data/reducer'

export default combineReducers({
  mapView: mapViewReducer
})
