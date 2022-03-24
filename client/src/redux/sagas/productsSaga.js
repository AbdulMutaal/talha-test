import { put, takeLatest } from 'redux-saga/effects';
import jwt_decode from "jwt-decode";
import API from "../../api/api";

function* getProducts() {
    try {
        const json = yield API.getProducts()
            .then(res => {return (res);
            })
            .catch(err => {
                throw err.response.data;
            });
        yield put({
            type: "SET_PRODUCTS",
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
export default function* actionProduct() {
    yield takeLatest('GET_PRODUCTS', getProducts)
}
