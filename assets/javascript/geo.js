//**** Captures latitude and longitude of starting location from browswer geolocation API and 

var startLat;
var startLng;
var destLat;
var destLng;


//determines geolocation from browser

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        lattitude.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//console.logs the browser's latitude and longitude

function showPosition(position) {
    $("#latreport").innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
    console.log("my position: " + position.coords.latitude + "," + position.coords.longitude);
    startLat = position.coords.latitude;
    startLng = position.coords.longitude;
}

// -----------------------------------------------------

// **can be used to hardcode the starting location
//var startingAddress = "starting location";
//var geoLocURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + startLocation + "&key=AIzaSyB6P6KfBWOmNmMk9IRDVgl8OTmVtMmSEQk";
//var startingAddress;

var getStartLatLong = function() {
    //var destinationAddress = $("#destination").val().trim();
    var geoLocURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + startLocation + "&key=AIzaSyB6P6KfBWOmNmMk9IRDVgl8OTmVtMmSEQk";

    $.ajax({
        url: geoLocURL,
        method: "GET"
    }).done(function(results) {
        console.log("lat: " + results.results["0"].geometry.location.lat);
        console.log("lat: " + results.results["0"].geometry.location.lng);
        startLat = results.results["0"].geometry.location.lat;
        startLng = results.results["0"].geometry.location.lng;
    });
};

//var geoLocURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&key=AIzaSyB6P6KfBWOmNmMk9IRDVgl8OTmVtMmSEQk";
//var startingAddress;


var getDestLatLong = function() {
    //var destinationAddress = $("#destination").val().trim();
    var geoLocURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&key=AIzaSyB6P6KfBWOmNmMk9IRDVgl8OTmVtMmSEQk";
    $.ajax({
        url: geoLocURL,
        method: "GET"
    }).done(function(results) {
        console.log("lat: " + results.results["0"].geometry.location.lat);
        console.log("lat: " + results.results["0"].geometry.location.lng);
        destLat = results.results["0"].geometry.location.lat;
        destLng = results.results["0"].geometry.location.lng;
    });
};

//gets broswer geolocation and stores
//getLocation();

//gets destination geolocation and stores
//getLatLong();
