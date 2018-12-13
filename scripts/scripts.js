
// Geocode format:
// https://geocode.xyz/location?outputformat or https://geocode.xyz/?locate=location&outputformat
// no API key = 1 request per second
const bathroomApp = {
	ada: false,
	unisex: false
}

const userLocation = {}


$( document ).ready(function() {

	$('#submitLocation').on('click', function(e){

		e.preventDefault();

		// if ($('#unisex').is(":checked")) {
		//       alert('it works');
		//     }

		const address = $('[name=address]').val();
		userLocation.address = address;

		bathroomApp.getCoordinates(userLocation.address);
	});



});

bathroomApp.getCoordinates = (address) => {
	$.ajax({
		url: `https://geocode.xyz/${address}?json=1`,
		method: 'GET',
		dataType: 'json',
	}).then(function(response) {
		const latitude = response.latt;
		const longitude = response.longt;
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
		// bathroomApp.displayBathrooms(response);

	});
}

bathroomApp.displayBathrooms  = (bathrooms) => {
	bathrooms.map(function(bathrooms) {
		const bathroomHtml = 	
		
	}).join('');
	$('#bathrooms').empty().append(artHtml);
}