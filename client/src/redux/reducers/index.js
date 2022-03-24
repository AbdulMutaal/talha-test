import { combineReducers } from 'redux';
import userReducer from "./userReducer";
import productsReducer from "./productsReducer";
import ordersReducer from './ordersReducer';

const reducer = combineReducers({
    userReducer,
    productsReducer,
    ordersReducer
});

export default reducer;
