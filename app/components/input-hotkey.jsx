import React from 'react';

const NAMES = {
	Control: 'Ctrl',
};

const InputHotkey = React.memo(props => {

	const onKeyDown = event => {
		event.preventDefault();
		const newValue = format(event);
		if (props.value !== newValue) {
			fireChange(newValue);
		}
	};

	const fireChange = value => {
		if (props.onChange) {
			props.onChange(value);
		}
	};

	const format = event => {
		const keys = [];
		if (event.ctrlKey) {
			keys.push(getName("Control"));
		}
		if (event.altKey) {
			keys.push(getName("Alt"));
		}
		if (event.shiftKey) {
			keys.push(getName("Shift"));
		}
		if (keys.indexOf(getName(event.key)) == -1) {
			keys.push(getName(event.key));
		}
		return keys.join("+");
	};

	const getName = value => {
		return NAMES[value] || value;
	};

	return (
		<input
			{...props}
			type="text"
			onKeyDown={event => onKeyDown(event)}
			/>
	);
});

export default InputHotkey;
