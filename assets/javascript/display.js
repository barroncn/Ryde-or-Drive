$(document).ready(function() {
    /* global firebase */
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAAi7s87SW5XOtn5dKwIBwEIZsY4tBZfkg",
        authDomain: "ryde-or-dryve.firebaseapp.com",
        databaseURL: "https://ryde-or-dryve.firebaseio.com",
        projectId: "ryde-or-dryve",
        storageBucket: "ryde-or-dryve.appspot.com",
        messagingSenderId: "998231386924"
    };
    firebase.initializeApp(config);

    var db = firebase.database();

    var startLocation = "";
    var destination = "";
    var mpg = "";
    var startLat;
    var startLng;
    var destLat;
    var destLng;
    var startAddress;
    var endAddress;
    var carYear;
    var userYear;
    var userMPG;
    var classClick;

    //This funciton will clear a search and reset the page
    var reset = function() {
        startLocation = "";
        destination = "";
        mpg = "";
        startLat = "";
        startLng = "";
        destLat = "";
        destLng = "";
        $("#badEntry").hide();
        $("#main").show();
        $("#loading").hide();
        $("#display").hide();
        $("#startLocation").val("");
        $("#destination").val("");
        $("#mpg").val("");
        $("#locationcheck").prop("checked", false);
        $("#startLocationParent").show();
        $("#mpgParent").show();
        $("#dropdownMenu1").text("Car Year");
        $("#dropdownMenu2").text("Car Class");
        $("#message").html("");
        userMPG = "";
        $("#carClass").data("click", "unclicked");
        classClick = $("#carClass").data("click");
    };

    //reset
    $("#reset").on("click", function() {
        reset();
    });

    //USING DROPDOWN TO SELECT MPG
    //==============================================================================================================================================================
    $(document).ready(function() {
        $("#carYear li a").click(function() {
            $("#dropdownMenu1").text($(this).text());
        });
    });

    $(document).ready(function() {
        $("#carClass li a").click(function() {
            $("#dropdownMenu2").text($(this).text());
        });
    });

    $(".years").on("click", function() {
        carYear = ($(this).data("year"));
    });

    $(".carClass").on("click", function() {
        var carClass = ($(this).data("class"));
        $("#carClass").data("click", "clicked");
        classClick = $("#carClass").data("click");
        $("#mpgParent").hide();
        db.ref().once("value", function(snapshot) {
            userMPG = snapshot.child(JSON.stringify(carYear) + "/" + carClass).val();
        });
    });
    //==============================================================================================================================================================

    //SETTING UP THE PAGE
    //==============================================================================================================================================================
    $("#badEntry").hide();
    $("#arrow").hide();
    $("#display").hide();
    $("#loading").hide();
    $("#locationcheck").on("click", function() {
        if ($("#locationcheck").prop("checked")) {
            $("#startLocationParent").hide();
        }
        if (!$("#locationcheck").prop("checked")) {
            $("#startLocationParent").show();
        }
    });
    //==============================================================================================================================================================

    //WHEN THE USER CLICKS THE SUBMIT BUTTON
    //==============================================================================================================================================================

    $("#submit").on("click", function(event) {
        event.preventDefault();
        startLocation = $("#startLocation").val().trim();
        destination = $("#destination").val().trim();
        mpg = $("#mpg").val();

        if (((startLocation !== "") || ($("#locationcheck").prop("checked"))) && (destination !== "") && ((mpg !== "")) || (classClick === "clicked")) {
            if (classClick === "clicked") {
                mpg = userMPG;
            }
            // waits for getStartLatLong to finish
            if (!$("#locationcheck").prop("checked")) {
                $("#theDistance").text("");
                $("#main").hide();
                $("#loading").show();
                getStartLatLong().done(function() {
                    getDestLatLong().done(function() {
                        $.when(uberInfo(startLat, startLng, destLat, destLng), lyftInfo(startLat, startLng, destLat, destLng), getDistanceTime(startAddress, endAddress)).done(function() {
                            console.log("ALL DONE, HIDE LOADING GIF");
                            $("#loading").hide();
                            console.log($("#theDistance").text() + " DISTANCE");
                            if ($("#theDistance").text() !== "") {
                                $("#display").show();
                            }
                        });
                    });
                });
            }
            else {
                $("#theDistance").text("");
                $("#main").hide();
                $("#loading").show();
                getLocation(startAddress).done(function() {
                    getDestLatLong().done(function() {
                        $.when(uberInfo(startLat, startLng, destLat, destLng), lyftInfo(startLat, startLng, destLat, destLng), getDistanceTime(startAddress, endAddress)).done(function() {
                            console.log("ALL DONE, HIDE LOADING GIF");
                            $("#loading").hide();
                            console.log($("#theDistance").text() + " DISTANCE");
                            if ($("#theDistance").text() != "") {
                                $("#display").show();
                            }
                        });
                    });
                });
            }
        }
        else {
            $("#message").html("Please input all information");
        }
    });
    //==============================================================================================================================================================

    //GEOLOCATION FUNCTIONS AND API REQUESTS
    //==============================================================================================================================================================

    //determines geolocation from browser
    function getLocation() {
        var d1 = new $.Deferred();
        var d2 = new $.Deferred();
        var showPosition = function(position) {

            startLat = position.coords.latitude;
            startLng = position.coords.longitude;

            //Request the formatted address of the users current coordinates and puts them in formatS
            var URL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + startLat + "," + startLng + "&key=AIzaSyB6P6KfBWOmNmMk9IRDVgl8OTmVtMmSEQk";
            $.ajax({
                url: URL,
                method: "GET"
            }).done(function(response) {
                startAddress = response.results["0"].formatted_address;
                $("#formatS").html(startAddress);
                $("#arrow").show();
                d1.resolve(startAddress);
            });
            var tmpLatLng = {
                startLat: startLat,
                startLng: startLng,
                startAddress: startAddress
            };
            d2.resolve(tmpLatLng);
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else {
            lattitude.innerHTML = "Geolocation is not supported by this browser.";
        }
        return $.when(d1, d2).done(function() {}).promise();
    }

    var getStartLatLong = function() {
        var geoLocURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + startLocation + "&key=AIzaSyB6P6KfBWOmNmMk9IRDVgl8OTmVtMmSEQk";
        var d = new $.Deferred();
        $.ajax({
            url: geoLocURL,
            method: "GET"
        }).done(function(results) {
            startAddress = results.results["0"].formatted_address;
            $("#formatS").html(startAddress); // + ", " + results.results["0"].address_components[3].short_name + ", " + results.results["0"].address_components[6].short_name + " ");
            $("#arrow").show();
            startLat = results.results["0"].geometry.location.lat;
            startLng = results.results["0"].geometry.location.lng;
            var tmpLatLng = {
                startLat: startLat,
                startLng: startLng,
                startAddress: startAddress
            };
            d.resolve(tmpLatLng);
        });
        return d.promise();

    };
    var getDestLatLong = function() {
        var geoLocURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&key=AIzaSyB6P6KfBWOmNmMk9IRDVgl8OTmVtMmSEQk";
        var d = new $.Deferred();
        $.ajax({
            url: geoLocURL,
            method: "GET"
        }).done(function(results) {
            endAddress = results.results["0"].formatted_address;
            $("#formatD").text(endAddress);
            destLat = results.results["0"].geometry.location.lat;
            destLng = results.results["0"].geometry.location.lng;
            var tmpLatLng = {
                destLat: destLat,
                destLng: destLng,
                endAddress: endAddress
            };
            d.resolve(tmpLatLng);
        });
        return d.promise();
    };
    //==============================================================================================================================================================

    //UBER
    //==============================================================================================================================================================

    function uberInfo(y, x, yy, xx) { //starting latitude=x, starting longitude = y, ending latitude = xx, ending longitude = yy

        //This token will need to be updated
        var token = "KA.eyJ2ZXJzaW9uIjoyLCJpZCI6InMxNWdRNlUwUU02am5rM1NoN2Zaenc9PSIsImV4cGlyZXNfYXQiOjE1MzI0NDUwOTMsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.mciCCTWOBAnwOdf10uqwGAvqNrpLh_PbemoDRTg01dY";
        var d1 = new $.Deferred();
        var d2 = new $.Deferred();
        // AJAX request for Uber's time estimate information    
        $.ajax({
            url: "https://api.uber.com/v1.2/estimates/time",
            method: "GET",
            data: {
                start_latitude: y,
                start_longitude: x,
                access_token: token
            },
            success: function(uberTimeResults) {
                //This loop will ensure we get the data for uberX, we can easily add another if statement to set a variable in case we want to an estimate for other types of uber
                for (var i = 0; i < uberTimeResults.times.length; i++) {
                    if ("uberX" === uberTimeResults.times[i].display_name) {
                        var uberXindex = i;
                    }
                }
                if (uberXindex == undefined) {
                    //var minutesTilUber = Math.round(uberTimeResults.times[uberXindex].estimate / 60); //Minutes away of the closest Uber
                    // if (!minutesTilUber) {
                    $("#uberETA").text(" Currently there are no drivers available.");
                }
                else {
                    var minutesTilUber = Math.round(uberTimeResults.times[uberXindex].estimate / 60); //Minutes away of the closest Uber
                    $("#uberETABefore").text(" A driver in your area is ");
                    $("#uberETA").text(minutesTilUber + " minutes");
                    $("#uberETAAfter").text(" away!");
                }
                d1.resolve(minutesTilUber);
            }
        });

        //AJAX request for Uber's price estimate information.
        $.ajax({
            url: "https://api.uber.com/v1.2/estimates/price",
            method: "GET",
            data: {
                start_latitude: y,
                start_longitude: x,
                end_latitude: yy,
                end_longitude: xx,
                access_token: token
            },
            success: function(uberPriceResults) {
                console.log("UBER PRICE RESULTS");
                console.log(uberPriceResults);
                for (var i = 0; i < uberPriceResults.prices.length; i++) {
                    if ("uberX" === uberPriceResults.prices[i].display_name) {
                        var uberXindex = i;
                        var uberXprice = uberPriceResults.prices[uberXindex].estimate; //The range of the Uber Price Estimate
                        console.log("UBERXPRICE: " + uberXprice);
                        var uberAverageXprice = Math.round((uberPriceResults.prices[uberXindex].high_estimate + uberPriceResults.prices[uberXindex].low_estimate) / 2); //The average of the range of prices in case we want Jim to get his way --- nice
                        $("#ubercost").text(uberXprice);

                        return d2.resolve(uberXprice, uberAverageXprice);
                    }
                    else if (i === uberPriceResults.prices.length - 1) {
                        $("#ubercost").text("No price estimate available.");
                        d2.resolve();
                    }
                }

            },
            error: function() {
                $("#ubercost").text("No price estimate available.");
                d2.resolve();
            }
        });
        console.log("UBER FINISHED");
        return $.when(d1, d2).done(function() {}).promise();
    }
    //==============================================================================================================================================================

    //LYFT
    //==============================================================================================================================================================

    function lyftInfo(y, x, yy, xx) {

        var lyftToken;
        var clientId = '3TY5gGnnFF3h';
        var clientSecret = 'BoWG3zPcjYe0HSqOvG4IKuIjFm5dT9hM';
        var d1 = new $.Deferred();
        var d2 = new $.Deferred();

        //Requests a token
        $.ajax({
            url: 'https://api.lyft.com/oauth/token',
            type: 'POST',
            data: {
                grant_type: 'client_credentials',
                scope: 'public'
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(clientId + ":" + clientSecret));
            },
            success: function(response) {
                lyftToken = response.access_token;

                //Uses token to request driver ETA information
                var lyftETAData = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://api.lyft.com/v1/eta?lat=" + y + "&lng=" + x,
                    "method": "GET",
                    "headers": {
                        "authorization": "Bearer " + lyftToken
                    }
                };

                $.ajax(lyftETAData).done(function(lyftTimeResults) {
                    // if(lyftTimeResults.error =="no_service_in_area"){
                    //     $("#lyftETA").text("");
                    // }
                    // else{
                    console.log(lyftTimeResults);
                    for (var i = 0; i < lyftTimeResults.eta_estimates.length; i++) {
                        if ("Lyft" === lyftTimeResults.eta_estimates[i].display_name) {
                            var lyftindex = i;
                        }
                    }
                    if (lyftindex == undefined) {
                        $("#lyftETA").text(" Currently there are no drivers available.");
                    }
                    else {
                        var minutesTilLyft = Math.round(lyftTimeResults.eta_estimates[lyftindex].eta_seconds / 60);
                        console.log(minutesTilLyft + " minutes til Lyft");
                        $("#lyftETABefore").html("A driver in your area is <span id='lyftETA'>" + minutesTilLyft + " minutes</span> away!");
                    }
                    d1.resolve(minutesTilLyft);
                    // }
                });

                //Uses token to request price estimate
                var lyftPriceData = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://api.lyft.com/v1/cost?start_lat=" + y + "&start_lng=" + x + "&end_lat=" + yy + "&end_lng=" + xx,
                    "method": "GET",
                    "headers": {
                        "authorization": "Bearer " + lyftToken
                    }
                };

                $.ajax(lyftPriceData).done(function(lyftPriceResults) {
                    // if(lyftPriceResults.error =="no_service_in_area"){
                    //     $("#lyftcost").text("There is no service available in this area.");
                    // }
                    // else{
                    //If there is a result from the price estimate request
                    if (lyftPriceResults.cost_estimates.length > 0) {
                        for (var i = 0; i < lyftPriceResults.cost_estimates.length; i++) {
                            if ("Lyft" === lyftPriceResults.cost_estimates[i].display_name) {
                                var lyftindex = i;
                            }
                        }
                        var lyftAveragePrice = Math.round((lyftPriceResults.cost_estimates[lyftindex].estimated_cost_cents_min + lyftPriceResults.cost_estimates[lyftindex].estimated_cost_cents_max) / 200);
                        if (lyftPriceResults.cost_estimates[lyftindex].estimated_cost_cents_min !== lyftPriceResults.cost_estimates[lyftindex].estimated_cost_cents_max) {
                            var lyftPrice = "$" + Math.round(lyftPriceResults.cost_estimates[lyftindex].estimated_cost_cents_min / 100) + "-" + Math.round(lyftPriceResults.cost_estimates[lyftindex].estimated_cost_cents_max / 100);
                        }
                        else {
                            lyftPrice = "$" + Math.round(lyftPriceResults.cost_estimates[lyftindex].estimated_cost_cents_min / 100);
                        }
                        $("#lyftcost").text(lyftPrice);
                        d2.resolve(lyftPrice);
                    }
                    //If there is no price estimate for the given trip request
                    else {
                        $("#lyftcost").text("No price estimate available.");
                    }
                    d2.resolve(lyftPrice);
                    // }
                });


            }, //ends success
            // error: function() {
            //     $("#lyftcost").text("There is no price estimate available.");
            //     $("#lyftETA").text(" Currently there are no drivers available.");
            // }

        }); //ends initial AJAX request
        console.log("LIFT FINISHED");
        return $.when(d1, d2).done(function() {}).promise();
    } //end function

    //==============================================================================================================================================================

    //GET THE DRIVE DISTANCE AND DRIVE TIME FROM GOOGLE DIRECTIONS
    //==============================================================================================================================================================

    //This function will give us the drive distance and time from the Google Directions Service API JavaScript Library. Gas cost is also calculatd here.
    function getDistanceTime(x, y) {
        var d = new $.Deferred()
        var directionsService = new google.maps.DirectionsService();
        var request = {
            origin: x, // a city, full address, landmark etc
            destination: y,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                console.log("DISTANCE: " + response.routes[0].legs[0].distance.text);
                console.log("DURATION: " + response.routes[0].legs[0].duration.text);
                var distance = response.routes[0].legs[0].distance.text;
                var duration = response.routes[0].legs[0].duration.text;
                $("#theDistance").text(distance);
                $("#theDuration").text(duration);
                //Drive Cost
                var driveDistance = parseInt(distance);
                var gasPrice = 2.50;
                var driveCost = (driveDistance / mpg) * gasPrice;
                $("#gascost").text("$" + driveCost.toFixed(2));
                d.resolve();
            }
            else {
                //alert("There is no route information available for this trip");
                console.log("NO ROUTE INFO FOR TRIP");
                $("#badEntry").show();
                setTimeout(reset, 3000);
                d.resolve();
            }
        });
        return d.promise();
    }

}); //doc.ready
