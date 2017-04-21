
export default class Timer {

	start() {
		this.startDate = new Date();
	}

	stop() {
		this.stopDate = new Date();
	}

	getTime() {
		return this.stopDate - this.startDate;
	}

}
