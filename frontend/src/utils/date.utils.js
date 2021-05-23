export function getFormattedDate(date) {
	console.log("!!!")
	console.log(date)
	console.log(date.getHours() + "." + date.getMinutes())
	return date.getHours() + "." + date.getMinutes()
}

export function getElapsedTime(date) {
	return new Date() - date
}

export default (getFormattedDate, getElapsedTime)