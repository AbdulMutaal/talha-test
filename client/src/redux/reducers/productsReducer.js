const isEmpty = require("is-empty");

const productsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return {
                ...state,
                productsFound: !isEmpty(action.json),
                products: action.json,
            };
        default:
            return state;
    }
};
export default productsReducer;
