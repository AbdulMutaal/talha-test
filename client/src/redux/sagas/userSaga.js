import { put, takeLatest } from 'redux-saga/effects';
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import API from "../../api/api";

function* loginUser(userData) {
    try {
        const json = yield API.loginUser(userData.userData)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem("jwtToken", token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                return (decoded);
            })
            .catch(err => {
                throw err.response.data;
            });
        yield put({
            type: "SET_CURRENT_USER",
            json: json
        });
    }
    catch (error) {
        yield put({
            type: 'SET_CURRENT_USER_FAILED',
            error
        })
    }

}
function* getWallet1(userData) {
    try {
        const json = yield API.getWallet(userData.userData)
            .then(res => {
                const response= res.data;

                return (response);
            })
            .catch(err => {
                throw err.response.data;
            });
        yield put({
            type: "SET_WALLET1",
            json: json
        });
    }
    catch (error) {
        yield put({
            type: 'SET_CURRENT_USER_FAILED',
            error
        })
    }

}

function* getCustomers(userData) {
    try {
        const json = yield API.getCustomers(userData.userData)
            .then(res => {
                const response= res.data;

                return (response);
            })
            .catch(err => {
                throw err.response.data;
            });
        yield put({
            type: "SET_CUSTOMERS",
            json: json
        });
    }
    catch (error) {
        yield put({
            type: 'SET_CURRENT_USER_FAILED',
            error
        })
    }

}
function* loadWallet(userId) {
    try {
        const json = yield API.loadWallet(userId)
            .then(res => {
                const wallet  = res.data;
                return (wallet);
            })
            .catch(err => {
                throw err.response.data;
            });
        yield put({
            type: "SET_WALLET",
            json: json
        });
    }
    catch (error) {
        yield put({
            type: 'SET_CURRENT_USER_FAILED',
            error
        })
    }

}

function* logOutUser() {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    yield put({
        type: "SET_CURRENT_USER",
        json: {},
    });
}

export default function* actionLoginUser() {
    yield takeLatest('LOGIN_USER', loginUser)
    yield takeLatest('GET_CUSTOMERS', getCustomers)
    yield takeLatest('LOAD_WALLET', loadWallet)
    yield takeLatest('GET_WALLET1', getWallet1)
    yield takeLatest('LOGOUT_USER', logOutUser)
}
