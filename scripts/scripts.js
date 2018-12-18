// NOTE: I realized after completing this that sometimes the API I am getting the list of bathrooms from has repeat data. It gets data
// from users submitting bathrooms and it looks like some have multiple submissions. I tested everything with my home address where this
// wasn't an issue, then tested with HackerYou's and saw that Come As You Are has a number of repeat entries in their API and is probably
// the worst offender. I just wanted to let you know that I'm not duplicating data or anything, it's just a crowdsourced API so the data 
// it gives back isn't quite perfect and I wasn't sure if there was anything I could do about that.


// Bathroom App Object

const bathroomApp = {
	apiKey: '9083d4eaf36ba7',
	ada: false,
	unisex: false,
	currentPage: 1
}

// Empty Object to hold location data

const userLocation = {}


// Functions:

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
			unisex: bathroomApp.unisex,
			page: 1
		}
	}).then(function(response) {
		// console.log(response);
		bathroomApp.displayBathrooms(response);

		if (bathroomApp.currentPage == 1) {
			bathroomApp.currentPage = 2;
			bathroomApp.showMoreButton();
			bathroomApp.showMoreSubmitHandler();
		}
	});
}

// Show inital 10 bathrooms:

bathroomApp.displayBathrooms  = (bathrooms) => {
	// console.log(bathrooms);
	const bathroomHtml = bathrooms.map(function(bathrooms) {
		if (!bathrooms.directions) {
		     return `<li>
     			<h2>${bathrooms.name}</h2>
     			<p class="address">${bathrooms.street}</p>
     			<p class="address">${bathrooms.city}</p>
     			<p class="descriptionPlaceholder">No description provided.</p>								
     			</li>`
		}  else {
			return `<li>
				<h2>${bathrooms.name}</h2>
				<p class="address">${bathrooms.street}</p>
				<p class="address">${bathrooms.city}</p>
				<p>${bathrooms.directions}</p>								
				</li>`
		}

	}).join('');
	$('#bathrooms').empty().append(bathroomHtml);
}

// Functions for 'Show More' button:

bathroomApp.showMoreButton = () => {
	$('#bathroomList').append(`
		<div class='submit showMore'>
			<input type="submit" value="Show More" id="showMore">
		</div>`);
}

bathroomApp.showMoreSubmitHandler = () => {
	$('#showMore').on('click', function(e){
		e.preventDefault();
		$.ajax({
			url: 'https://www.refugerestrooms.org/api/v1/restrooms/by_location.json',
			method: 'GET',
			dataType: 'json',
			data: {
				lat: userLocation.latt,
				lng: userLocation.longt,
				ada: bathroomApp.ada,
				unisex: bathroomApp.unisex,
				page: bathroomApp.currentPage
			}
		}).then(function(response) {
			bathroomApp.currentPage = bathroomApp.currentPage + 1;
			bathroomApp.displayMore(response);
		})
	});
}

bathroomApp.displayMore  = (bathrooms) => {
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
	$('#bathrooms').append(bathroomHtml);
}

