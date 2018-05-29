import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { enableBatching } from 'redux-batched-actions'
import reducer from './reducer'

const middlewares = [thunk]
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)
export default createStoreWithMiddleware(enableBatching(reducer))
