const isEmpty = require("is-empty");

const ordersReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_ORDERS':
            return {
                ...state,
                ordersFound: !isEmpty(action.json),
                orders: action.json,
            };
        default:
            return state;
    }
};
export default ordersReducer;
