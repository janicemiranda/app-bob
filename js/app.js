document.addEventListener('DOMContentLoaded', function () {
	const today = new Date();
	const formattedDate = today.toISOString().split('T')[0]; // yyyy-mm-dd
	document.getElementById('fecha').value = formattedDate;
});
