"use strict";

function TextMeasurer() {

	function getTextWidth(text, font) {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		context.font = font;
		return context.measureText(text).width;
	}

	return {
		getTextWidth : getTextWidth
	}
}

module.exports = new TextMeasurer();
