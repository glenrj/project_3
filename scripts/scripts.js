
// Bathroom App Object

const bathroomApp = {
	apiKey: '9083d4eaf36ba7',
	ada: false,
	unisex: false

}

// Empty Object to hold location data

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
		bathroomApp.address = address;

		bathroomApp.getCoordinates(bathroomApp.address);
	});

});

// Get coordinates from geocoding API using user's address:

bathroomApp.getCoordinates = (address) => {
	$.ajax({
		url: `https://us1.locationiq.com/v1/search.php?key=${bathroomApp.apiKey}&q=${address}&format=json`,
		method: 'GET',
		dataType: 'json',
	}).then(function(response) {
		// console.log(response);
		const latitude = response[0].lat;
		const longitude = response[0].lon;
		userLocation.latt = latitude;
		userLocation.longt = longitude;
		bathroomApp.getBathrooms(userLocation.latt, userLocation.longt);
	});
}

// Get initial bathroom list from coordinates:

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
		// console.log(response);
		bathroomApp.displayBathrooms(response);

	});
}

// Add next 10 bathrooms to the list:

bathroomApp.displayBathrooms  = (bathrooms) => {
	// console.log(bathrooms);
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