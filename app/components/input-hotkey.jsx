import React, {PureComponent} from 'react';

const NAMES = {
	Control: 'Ctrl',
};

export default class InputHotkey extends PureComponent {

	render() {
		return (
			<input
				{...this.props}
				type="text"
				ref={input => this.input = input}
				onKeyDown={event => this.onKeyDown(event)}
				value={this.props.value}
				/>
		);
	}

	onKeyDown(event) {
		event.preventDefault();
		const newValue = this.format(event);
		if (this.props.value !== newValue) {
			this.fireChange(newValue);
		}
	}

	fireChange(value) {
		if (this.props.onChange) {
			this.props.onChange(value);
		}
	}

	format(event) {
		const keys = [];
		if (event.ctrlKey) {
			keys.push(this.getName("Control"));
		}
		if (event.altKey) {
			keys.push(this.getName("Alt"));
		}
		if (event.shiftKey) {
			keys.push(this.getName("Shift"));
		}
		if (keys.indexOf(this.getName(event.key)) == -1) {
			keys.push(this.getName(event.key));
		}
		return keys.join("+");
	}

	getName(value) {
		return NAMES[value] || value;
	}

}
