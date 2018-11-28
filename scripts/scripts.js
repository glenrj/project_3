
// Geocode format:
// https://geocode.xyz/location?outputformat or https://geocode.xyz/?locate=location&outputformat
// no API key = 1 request per second

const userLocation = {}

$( document ).ready(function() {

	$('#submitLocation').on('click', function(e){

		e.preventDefault();

		const address = $('[name=address]').val();
		userLocation.address = address;

		getCoordinates(userLocation.address);
	});



});

getCoordinates = (address) => {
	$.ajax({
		url: `https://geocode.xyz/${address}?json=1`,
		method: 'GET',
		dataType: 'json',
	}).then(function(response) {
		const latitude = response.latt;
		const longitude = response.longt;
		userLocation.latt = latitude;
		userLocation.longt = longitude;
		getBathrooms(userLocation.latt, userLocation.longt);
	});
}

getBathrooms = (latitude, longitude) => {
	// console.log(latitude, longitude);
	$.ajax({
		url: 'https://www.refugerestrooms.org/api/v1/restrooms/by_location.json',
		method: 'GET',
		dataType: 'json',
		data: {
			lat: latitude,
			lng: longitude
		}
	}).then(function(response) {
		console.log(response);
	});
}

displayBathrooms  = () => {
	
}