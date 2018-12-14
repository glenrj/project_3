
// Geocode format:
// https://geocode.xyz/location?outputformat or https://geocode.xyz/?locate=location&outputformat
// no API key = 1 request per second
const bathroomApp = {
	apiKey: 'AIzaSyBFCYLY2DiSYIwhBkpvrcLZJJ95uJZZdX4',
	ada: false,
	unisex: false

}

const userLocation = {}


$( document ).ready(function() {

	$('#submitLocation').on('click', function(e){

		e.preventDefault();

		if ($('#ada').is(":checked")) {
			bathroomApp.ada = true;
		} else {
			bathroomApp.ada = false;
		}

		if ($('#unisex').is(":checked")) {
		     bathroomApp.unisex = true;
		} else {
			bathroomApp.unisex = false;
		}

		const address = $('[name=address]').val();
		userLocation.address = address;

		bathroomApp.getCoordinates(userLocation.address);
	});

});

bathroomApp.getCoordinates = (address) => {
	$.ajax({
		url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${bathroomApp.apiKey}`,
		method: 'GET',
		dataType: 'json',
	}).then(function(response) {
		// console.log(response);
		const latitude = response.results[0].geometry.location.lat;
		const longitude = response.results[0].geometry.location.lng;
		userLocation.latt = latitude;
		userLocation.longt = longitude;
		bathroomApp.getBathrooms(userLocation.latt, userLocation.longt);
	});
}

bathroomApp.getRequirements = () => {

}

bathroomApp.getBathrooms = (latitude, longitude) => {
	$.ajax({
		url: 'https://www.refugerestrooms.org/api/v1/restrooms/by_location.json',
		method: 'GET',
		dataType: 'json',
		data: {
			lat: latitude,
			lng: longitude,
			ada: bathroomApp.ada,
			unisex: bathroomApp.unisex
		}
	}).then(function(response) {
		console.log(response);
		bathroomApp.displayBathrooms(response);

	});
}

bathroomApp.displayBathrooms  = (bathrooms) => {
	console.log(bathrooms);
	const bathroomHtml = bathrooms.map(function(bathrooms) {
		const bathroomObj = `<li>
			<h2>${bathrooms.name}</h2>
			<p class="address">${bathrooms.street}</p>
			<p class="address">${bathrooms.city}</p>
			<p>${bathrooms.directions}								
						</li>`
			return bathroomObj
	}).join('');
	$('#bathrooms').empty().append(bathroomHtml);
}



// ORIGINAL GEOCODING API (LOCKED ME OUT BUT HERE FOR MY OWN REFERENCE IN CASE THE NEW ONE DOESN'T WORK):
	// $.ajax({
	// 	url: `https://geocode.xyz/${address}?json=1`,
	// 	method: 'GET',
	// 	dataType: 'json',