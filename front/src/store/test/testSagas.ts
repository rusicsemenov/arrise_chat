import { takeEvery } from 'redux-saga/effects';
import { checkSocket } from '../webSockets/webSocketsSaga.ts';

export default function* testSagas() {
    console.log('🧪 Test saga started');
    yield takeEvery('CHECK_CONNECTION', checkSocket);
}
