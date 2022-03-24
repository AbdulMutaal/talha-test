import { put, takeLatest } from 'redux-saga/effects';
import jwt_decode from "jwt-decode";
import API from "../../api/api";

function* getOrders(userData) {
    try {
        const json = yield API.getOrders(userData.userData)
            .then(res => {return (res);
            })
            .catch(err => {
                throw err.response.data;
            });
        yield put({
            type: "SET_ORDERS",
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
export default function* actionOrder() {
    yield takeLatest('GET_ORDERS', getOrders)
}
