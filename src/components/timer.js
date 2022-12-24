import React from 'react'
import { connect } from 'react-redux'

const Timer = (props) => {
	React.useEffect(() => {
		document.onkeypress = (e) => {
			if (e.keyCode === 32) {
				if (props.running) {
					props.stop()
				} else {
					props.start()
				}
			}
		}
		return () => {
			document.onkeypress = null
		}
	}, [props, props.running])

	const [fontstyle, ref] = useFontSize()
	const [heightstyle, buttonref] = useHeight(0.3)

	let time = props.time
	let values = []
	while (time > 0) {
		values.push(time % 60)
		time = Math.floor(time / 60)
	}
	values.reverse()
	values = padding([0, 0, 0], values)

	return (
		<div className='TimerContainer' ref={ref}>
			<div className='Timer' style={fontstyle(0.2)}>
				{values.map((value, index) => (
					<span key={index}>{(index > 0 ? ':' : '') + zeroPadding(value)}</span>
				))}
			</div>
			<button ref={buttonref} onClick={props.reset} style={{ ...fontstyle(0.06), ...heightstyle }}>reset</button>
			{props.running ?
				(<button onClick={props.stop} style={{ ...fontstyle(0.06), ...heightstyle }}>stop</button>) :
				(<button onClick={props.start} style={{ ...fontstyle(0.06), ...heightstyle }}>start</button>)}
		</div>
	)
}

function useSize() {
	const [size, setSize] = React.useState({ width: 0, height: 0 })
	const ref = React.useCallback(node => {
		if (node !== null) {
			const rect = node.getBoundingClientRect()
			setSize({ width: rect.width, height: rect.height })
			window.addEventListener('resize', () => {
				const rect = node.getBoundingClientRect()
				setSize({ width: rect.width, height: rect.height })
			})
		}
	}, []);
	return [size.width, size.height, ref]
}

function useHeight(ratio) {
	const [width, height, ref] = useSize()
	const style = {
		height: width * ratio
	}
	return [style, ref]
}

function useFontSize() {
	const [width, height, ref] = useSize()
	const style = (ratio) => ({
		fontSize: width * ratio
	})
	return [style, ref]
}

function padding(a, b) {
	let a_temp = a.slice()
	let b_temp = b.slice()
	a_temp.reverse()
	b_temp.reverse()
	let result = []
	for (let i = 0; i < Math.max(a.length, b.length); ++i) {
		result.push(i < b.length ? b_temp[i] : a_temp[i])
	}
	result.reverse()
	return result
}

function zeroPadding(value, digit = 2) {
	return padding('00'.split(''), String(value).split('')).join('')
}

function mapStateToProps(state) {
	return {
		time: state.time,
		running: state.running
	}
}

function mapDispatchToProps(dispatch) {
	return {
		init: () => dispatch({ type: 'INIT_TIME' }),
		reset: () => dispatch({ type: 'RESET' }),
		start: () => dispatch({ type: 'START' }),
		stop: () => dispatch({ type: 'STOP' }),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Timer)