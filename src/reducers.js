const initialState = {
	time: 0,
	startTime: null,
	stopTime: null,
	running: false,
}

export default function rootReducer(state=initialState, action) {
	switch (action.type) {
		case 'START_TIME':
			return { ...state, startTime: action.time }
		case 'TIME':
			return { ...state, time: action.time }
		case 'STOP_TIME':
			return { ...state, stopTime: action.time }
		case 'SET_IS_RUNNING':
			return { ...state, running: action.running }
		default:
			return state
	}
}