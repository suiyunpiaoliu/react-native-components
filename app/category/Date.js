Date.fromStr = function (str) {
	let nums = str.split(/[-T:\.]/g)
	nums[1] -= 1
	let date = new Date(...nums)
	return date
}
Date.tomorrow = function () {
	let date = new Date()
	date.setDate(date.getDate()+1)
	return date
}
Date.prototype.daysBefore = function (day) {
	let date = this;
	let today = date.getDate()
	date.setDate(today - day)
	return date
}
Date.prototype.daysAfter = function (day) {
	let date = this;
	let today = date.getDate()
	date.setDate(today + day)
	return date
}
Date.prototype.lastDayOfMonth = function () {
	let newDate = new Date(this.getFullYear(),this.getMonth()+1,0)
	return newDate.getDate()
}