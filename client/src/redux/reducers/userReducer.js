const isEmpty = require("is-empty");

const userReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                isAuthenticated: !isEmpty(action.json),
                user: action.json,
            };
        
            case 'SET_CUSTOMERS':
            return {
                ...state, 
                customersFound: !isEmpty(action.json),
                customersData: action.json,
            };
        case 'SET_WALLET':
            return {
                ...state,
                isWalletLoaded: !isEmpty(action.json),
                wallet: action.json,
            };
            case 'SET_WALLET1':
            return {
                ...state,
                isWallet1Loaded: !isEmpty(action.json),
                wallet1: action.json,
            };
        case 'SET_CURRENT_USER_FAILED':
            return {
                ...state,
                loginError: action.error,
                user:action.json
            };
        default:
            return state;
    }
};
export default userReducer;
