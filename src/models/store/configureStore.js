import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import defaultReducer from '../reducers/root';

const composeStore = compose( applyMiddleware(thunk) ) (createStore)

export default function configureStore() {


    const store = composeStore(defaultReducer)
 
    return store
}
