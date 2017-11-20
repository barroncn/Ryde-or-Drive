// ****here is some code that should work for determining geolocation assuming
// the user browswer supports it.  I think we shoudl have a check-box for the
// user to give our app permision to use their location - Jim
// -----------------------------------------------------
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
}
// -----------------------------------------------------