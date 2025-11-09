import { all, call, delay, spawn } from 'redux-saga/effects';
import { checkSocket, waitForSocketReady, watchSocketEvents } from './webSockets/webSocketsSaga.ts';

let attempts = 0;
const maxAttempts = 10;

export function* rootSaga() {
    // Wait for WebSocket connection with retries
    while (attempts < maxAttempts) {
        try {
            yield call(waitForSocketReady);
            break;
        } catch (e) {
            attempts++;
            console.error('Error in waitForSocketReady, retrying...', e);
            yield delay(1000 * attempts); // exponential backoff
        }
    }

    if (attempts >= maxAttempts) {
        console.error('🛑 Could not establish WebSocket connection after max attempts');
        return;
    }

    // Start other sagas that depend on WebSocket connection
    const sagasAfterWSConnect = [checkSocket, watchSocketEvents];
    const retrySagas = sagasAfterWSConnect.map((saga) => {
        return spawn(function* () {
            while (true) {
                try {
                    yield saga();
                    break;
                } catch (e) {
                    console.error('Saga error, restarting...', e);
                }
            }
        });
    });

    yield all(retrySagas);
}
