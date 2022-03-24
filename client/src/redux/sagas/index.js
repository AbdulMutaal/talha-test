import { all } from 'redux-saga/effects';
import actionLoginUser from './userSaga';
import actionProduct from './productsSaga';
import actionOrder from './ordersSaga';

export default function* rootSaga() {
    yield all([
        actionLoginUser(),
        actionProduct(),
        actionOrder()
    ]);
}