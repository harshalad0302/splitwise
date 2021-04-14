import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import userReducer from '../Reducers/User_reducers'
import { composeWithDevTools } from 'redux-devtools-extension';


export default () => {
    // Store creation
    const store = createStore(
        combineReducers({
            user: userReducer
        }),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )

    return store
}