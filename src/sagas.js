import { put, delay, take, actionChannel, select, fork, takeLatest, cancel, race } from 'redux-saga/effects'

function* tick() {
	while (true) {
		yield put({ type: 'TICK' })
		yield delay(500)
	}
}

function* updateTime() {
	const startTime = yield select((state) => state.startTime)
	yield put({ type: 'TIME', time: Math.floor((Date.now() - startTime) / 1000) })
}

function* time() {
	const tickChannel = yield actionChannel('TICK')
	while (true) {
		yield take(tickChannel)
		yield* updateTime()
	}
}

function* reset() {
	const resetChannel = yield actionChannel('RESET')
	while (true) {
		yield take(resetChannel)
		const { running } = yield select()
		const t = Date.now()
		if (running) {
			yield put({ type: 'START_TIME', time: t })
			yield put({ type: 'STOP_TIME', time: null })
		} else {
			yield put({ type: 'START_TIME', time: t })
			yield put({ type: 'STOP_TIME', time: t })
			yield put({ type: 'TIME', time: 0 })
		}
	}
}

function* syncLocalStorage() {
	yield fork(function* () {
		while (true) {
			const { time } = yield take('STOP_TIME')
			if (time == null) {
				localStorage.removeItem('stop_time')
			} else {
				localStorage.setItem('stop_time', time)
			}
		}
	})

	yield fork(function* () {
		while (true) {
			const { time } = yield take('START_TIME')
			if (time == null) {
				localStorage.removeItem('time')
			} else {
				localStorage.setItem('time', time)
			}
		}
	})
}

export default function* rootSaga() {
	yield* syncLocalStorage()
	let startTime = localStorage.getItem('time')
	let stopTime = localStorage.getItem('stop_time')
	let t
	if (stopTime != null) {
		startTime = Number(startTime)
		stopTime = Number(stopTime)
		t = stopTime - startTime
	} else {
		const now = Date.now()
		if (startTime == null) {
			startTime = now
		} else {
			startTime = Number(startTime)
		}
		t = now - startTime
	}
	yield put({ type: 'TIME', time: Math.floor(t / 1000) })

	if (stopTime != null) {
		yield take('START')
	}
	yield put({ type: 'START_TIME', time: Date.now() - t })
	yield put({ type: 'STOP_TIME', time: null })
	yield put({ type: 'SET_IS_RUNNING', running: true })
	
	let tickTask = yield fork(tick)
	yield fork(time)
	yield fork(reset)

	while (true) {
		yield take('STOP')
		yield put({ type: 'STOP_TIME', time: Date.now() })
		yield put({ type: 'SET_IS_RUNNING', running: false })
		yield cancel(tickTask)

		yield take('START')
		const { stopTime, startTime } = yield select()
		yield put({ type: 'START_TIME', time: Date.now() - (stopTime - startTime) })
		yield put({ type: 'STOP_TIME', time: null })
		yield put({ type: 'SET_IS_RUNNING', running: true })
		tickTask = yield fork(tick)
	}
}