export function getFormattedDate(date) {
	return date.getHours() + "." + date.getMinutes()
}

export function getElapsedTime(date) {
	return new Date() - date;
}

export default (getFormattedDate, getElapsedTime)