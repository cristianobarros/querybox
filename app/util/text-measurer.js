
class TextMeasurer {

	getTextWidth(text, font) {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		context.font = font;
		return context.measureText(text).width;
	}

}

export default new TextMeasurer();
