// Check if the browser supports Geolocation API
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } else {
	console.log("Geolocation is not supported by this browser.");
  }
  
  // Function to get the latitude and longitude
  function successFunction(position) {
	var lat = position.coords.latitude;
	var long = position.coords.longitude;
  
	// Call the function to get the city name
	getCityName(lat, long);
  }
  
  // Function to handle any errors
  function errorFunction(error) {
	console.log("Error getting location: " + error.message);
  }
  
  // Function to perform reverse geocoding to get the city name
  function getCityName(latitude, longitude) {
	var request = new XMLHttpRequest();
	var method = 'GET';
	var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
	var async = true;
  
	request.open(method, url, async);
	request.onreadystatechange = function() {
	  if (request.readyState == 4 && request.status == 200) {
		var data = JSON.parse(request.responseText);
		console.log(data);
		var addressComponents = data.results[0].address_components;
		for (var i = 0; i < addressComponents.length; i++) {
		  var types = addressComponents[i].types;
		  if (types.indexOf("locality") > -1) {
			// This is the city name
			console.log("City name is: " + addressComponents[i].long_name);
		  }
		}
	  }
	};
	request.send();
  }
  