export const getNews = () => ({
    type: 'GET_NEWS',
});

export const getProducts = () => ({
    type:'GET_PRODUCTS'
})

export const setProducts = (json) =>({
    type:'SET_PRODUCTS',
    json
})

export const getOrders = (userData) => ({
    type:'GET_ORDERS',
    userData
})

export const setOrders = (json) =>({
    type:'SET_ORDERS',
    json
})

export const getCustomers = (userData) => ({
    type:'GET_CUSTOMERS',
    userData
})

export const setCustomers = (json) =>({
    type:'SET_CUSTOMERS',
    json
})

export const getWallet1 = (userData) => ({
    type:'GET_WALLET1',
    userData
})

export const setWallet1 = (json) =>({
    type:'SET_WALLET1',
    json
})

export const loginUser = (userData) => ({
    type: 'LOGIN_USER',
    userData
});

export const loadWallet = (userData) => ({
    type: 'LOAD_WALLET',
    userData
});

export const setWallet = (json) => ({
    type: 'SET_WALLET',
    json
});

export const logOutUser = () => ({
    type: 'LOGOUT_USER',
});

export const setCurrentUser = (json) => ({
    type: 'SET_CURRENT_USER',
    json
});
