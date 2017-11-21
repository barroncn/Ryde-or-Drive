// ****here is some code that should work for determining geolocation assuming
// the user browswer supports it.  I think we shoudl have a check-box for the
// user to give our app permision to use their location - Jim
// -----------------------------------------------------
// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else {
//         x.innerHTML = "Geolocation is not supported by this browser.";
//     }
// }

// function showPosition(position) {
//     x.innerHTML = "Latitude: " + position.coords.latitude +
//         "<br>Longitude: " + position.coords.longitude;
// }
// -----------------------------------------------------
// var travelURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington%2CDC&destinations=New%20York%20City%2CNY&key=AIzaSyB6P6KfBWOmNmMk9IRDVgl8OTmVtMmSEQk";

// $.ajax({
//     url: travelURL,
//     method: "GET",
// }).done(function(results) {
//     // dataType: 'jsonp',
//     // // cache: false,
//     // success: function(response) {
//     //     alert(response);
//     // }
//     console.log(results);
// });


// var origin1 = new google.maps.LatLng(55.930385, -3.118425);
// var origin2 = 'Greenwich, England';
// var destinationA = 'Stockholm, Sweden';
// var destinationB = new google.maps.LatLng(50.087692, 14.421150);

// var service = new google.maps.DistanceMatrixService();
// service.getDistanceMatrix({
//     origins: [origin1, origin2],
//     destinations: [destinationA, destinationB],
//     travelMode: 'DRIVING',
//     transitOptions: TransitOptions,
//     drivingOptions: DrivingOptions,
//     unitSystem: UnitSystem,
//     avoidHighways: Boolean,
//     avoidTolls: Boolean,
// }, callback);

// function callback(response, status) {
//     // See Parsing the Results for
//     // the basics of a callback function.
// }
var directionsService = new google.maps.DirectionsService();

var request = {
    origin: 'Melbourne VIC', // a city, full address, landmark etc
    destination: 'Sydney NSW',
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
};

directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
        console.log(response); // the distance in metres
    }
    else {
        // oops, there's no route between these two locations
        // every time this happens, a kitten dies
        // so please, ensure your address is formatted properly
    }
});
