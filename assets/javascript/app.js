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

var startLocation = "";
var destination = "";
var mpg = "";

 
$("#submit").on("click", function(event){
    
    var startLat = "37.7752315"; // This will be the starting latitude we get from the Google API (from the users starting address input)
    var startLong = "-122.418075"; // This will be the starting longitude...
    var endLat = "37.7752415"; // This will be the destination lattitude we get from the Google API (from the users destination input)
    var endLong = "-122.518075"; // This wil be the destination longitude...
      
    event.preventDefault();
    startLocation = $("#startLocation").val(); //Do we need to .trim() this? 
    destination = $("#destination").val(); // Do we need to .trim() this?
    mpg = $("#mpg").val(); // Same... .trim()?
    
    if((startLocation !== "") && (destination !== "") && (mpg !== "")){
        
        // I'm thinking maybe we don't want to empty out the inputs, in case the user wants to go back and change one thing (I know I'm the one who put them in, just rethinking it)
        $("#startLocation").val("");
        $("#destination").val("");
        $("#mpg").val("");
        $("#message").html("");
        
        uberInfo(startLat, startLong, endLat, endLong); //This will call the function to get the Uber Info, using the coordinate variables created above
        //lyftInfo(startLat, startLong, endLat, endLong); //Same for the lyft info function (THIS IS NOT WORKING RIGHT NOW!! I'll have it done by Monday fa sho)
      }
      
    else{
      $("#message").html("Please input all information");
    }
    
});


//UBER
//============================================================================================================

function uberInfo(y, x , yy, xx){   //starting latitude=x, starting longitude = y, ending latitude = xx, ending longitude = yy
    
    // AJAX request for Uber's time estimate information    
    $.ajax({
            url: "https://api.uber.com/v1.2/estimates/time",
            method: "GET",
            data: {
                start_latitude: y,
                start_longitude: x,
                access_token:  "KA.eyJ2ZXJzaW9uIjoyLCJpZCI6InlaL3ZIdkJnU05TUkZFeTdiUFZuQVE9PSIsImV4cGlyZXNfYXQiOjE1MTM1NjU1NTQsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.OiMPjfswSr6QI5IdKzHDro8udDWi4Ok0C5a1oKrO_kQ"
            },
            success: function(uberTimeResults) {
                console.log(uberTimeResults);
                //This loop will ensure we get the data for uberX, we can easily add another if statement to set a variable in case we want to an estimate for other types of uber
                for(var i = 0; i< uberTimeResults.times.length; i++){
                    if("uberX" === uberTimeResults.times[i].display_name){
                         var uberXindex = i;
                    }
                }
                var minutesTilUber = Math.round(uberTimeResults.times[uberXindex].estimate / 60); //Minutes away of the closest Uber
                 console.log("minutes til next uber: " + minutesTilUber);
            }
        });

    // AJAX request for Uber's price estimate information. This will also give us the distance and duration of the trip.
    $.ajax({
        url: "https://api.uber.com/v1.2/estimates/price",
            method: "GET",
            data: {
                start_latitude: y,
                start_longitude: x,
                end_latitude: yy,
                end_longitude: xx,
                access_token:  "KA.eyJ2ZXJzaW9uIjoyLCJpZCI6InlaL3ZIdkJnU05TUkZFeTdiUFZuQVE9PSIsImV4cGlyZXNfYXQiOjE1MTM1NjU1NTQsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.OiMPjfswSr6QI5IdKzHDro8udDWi4Ok0C5a1oKrO_kQ"
            },
            success: function (uberPriceResults) {
                console.log(uberPriceResults);
                for(var i = 0; i< uberPriceResults.prices.length; i++){
                     if("uberX" === uberPriceResults.prices[i].display_name){
                         var uberXindex = i;
                     }
                }
                var uberXprice = uberPriceResults.prices[uberXindex].estimate;  //The range of the Uber Price Estimate
                var uberXdistance = uberPriceResults.prices[uberXindex].distance;    // The distance of the trip in miles
                var uberXduration = Math.round(uberPriceResults.prices[uberXindex].duration / 60);    //The minutes the trip will take
                var uberAverageXprice = Math.round((uberPriceResults.prices[uberXindex].high_estimate + uberPriceResults.prices[uberXindex].low_estimate) / 2); //The average of the range of prices in case we want Jim to get his way
                 console.log("price range for uber: " + uberXprice);
                 console.log("Distance of the trip: " + uberXdistance + " miles");
                 console.log("Time the trip takes: " + uberXduration + " minutes");
                 console.log("The average of the price range estimate: $" + uberAverageXprice);
            }
    });
}

// IGNORE LYFT, IT'S A MESS RN.

//LYFT
//=============================================================================================================
 
//  function lyftInfo(y, x, yy, xx){
     
     //THIS REQUESTS A TOKEN
    //  curl -X POST -H "Content-Type: application/json" \
    //  --user "3TY5gGnnFF3h:RG7kiKmkMkONJohppsspzrQOSPvtjB0m" \
    //  -d '{"grant_type": "client_credentials", "scope": "public"}' \
    //  'https://api.lyft.com/oauth/token'
    
    // $.ajax({
    //     url: "https://api.lyft.com/oauth/token",
    //     data: "grant_type=client_credentials&scope=public",
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Basic' + btoa('3TY5gGnnFF3h:k9mb4nD7YfCLexgq2BVdcUNHDdvVbuPp'));
    //         xhr.setRequestHeader('Accept-Language', 'en_US');
    //     },
    //     type: "POST",
    //     dataType: 'json',
    //         success: function (lyftToken) {
    //           console.log(JSON.stringify(lyftToken));
    //         },
    //         error: function(){
    //          alert("Cannot get data");
            
    //          }
    // });
    

    
    
    //THIS USES THE TOKEN TO ACCESS THE API
    //   curl --include -X GET -H 'Authorization: Bearer q6r9EOVZg0WMl1fScn/KM3sGRg6yVzmpDn9qjGPtukJcCCOY9P8H+mYAdgXdATgMcuuYBpZkbLV5zjpAGWat8cVFxm7esKv68DO3FwyWZM5yFBCU1xBO2gc=' \
    //  'https://api.lyft.com/v1/eta?lat=37.7763&lng=-122.3918&ride_type=lyft'
     
     
 //Getting cost estimate from Lyft:
     
    // import lyft from 'node-lyft';
    // let defaultClient = lyft.ApiClient.instance;
    
    // // Configure OAuth2 access token for authorization: Client Authentication
    // let clientAuth = defaultClient.authentications['Client Authentication'];
    // clientAuth.accessToken = 'YOUR ACCESS TOKEN';
    
    // let apiInstance = new lyft.PublicApi();
    
    // let optsCost = { 
    //   'start_lat': y,
    //   'start_lng': x,
    //   'end_Lat': yy, // Latitude of the ending location
    //   'end_Lng': xx, // Longitude of the ending location
    //   'ride_type': lyft // only return lyft class (not plus, etc)
    // };
    
    // apiInstance.getCost(opts).then((lyftPriceResults) => {
    //   console.log('API called successfully. Returned data: ' + lyftPriceResults);
    // }, (error) => {
    //   console.error(error);
    // });
 
 //Getting driver ETA from Lyft:
    
    // import lyft from 'node-lyft';
    // let defaultClient = lyft.ApiClient.instance;
    
    // // Configure OAuth2 access token for authorization: Client Authentication
    // let clientAuth = defaultClient.authentications['Client Authentication'];
    // clientAuth.accessToken = 'YOUR ACCESS TOKEN';
    
    // let apiInstance = new lyft.PublicApi();
    
    //let optsETA = {
        //   'start_lat': y,
        //   'start_lng': x, 
        //   'ride_type': lyft
    //}
    
    // apiInstance.getETA(opts).then((lyftTimeResults) => {
    //   console.log('API called successfully. Returned data: ' + lyftTimeResults);
    // }, (error) => {
    //   console.error(error);
    // });
     
     
  //Lyft API should return results in this form. They allow you to choose what kind of car you want so display_name: lyft should be the only result (hence [0])   
//      var lyftTimeResults = {
//                                  "eta_estimates": [
//                                   {
//                                      "display_name": "Lyft Line",
//                                      "ride_type": "lyft_line",
//                                      "eta_seconds": 120,
//                                      "is_valid_estimate": true
//                                   },
//                                   {
//                                      "display_name": "Lyft",
//                                      "ride_type": "lyft",
//                                      "eta_seconds": 120,
//                                      "is_valid_estimate": true
//                                   },
//                                   {
//                                      "display_name": "Lyft Plus",
//                                      "ride_type": "lyft_plus",
//                                      "eta_seconds": 660,
//                                      "is_valid_estimate": true
//                                   }
//                                  ]
//                             };
    
//     var minutesTilLyft = lyftTimeResults.eta_estimates[0].eta_seconds / 60; 
//     console.log(lyftTimeResults.eta_estimates[0].eta_seconds / 60 + " minutes");
    
//     var lyftPriceResults = {
//                                   "cost_estimates": [
//                                     {
//                                       "ride_type": "lyft_plus",
//                                       "estimated_duration_seconds": 913,
//                                       "estimated_distance_miles": 3.29,
//                                       "estimated_cost_cents_max": 2355,
//                                       "primetime_percentage": "25%",
//                                       "currency": "USD",
//                                       "estimated_cost_cents_min": 1561,
//                                       "display_name": "Lyft Plus",
//                                       "primetime_confirmation_token": null,
//                                       "cost_token": null,
//                                       "is_valid_estimate": true
//                                     },
//                                     {
//                                       "ride_type": "lyft_line",
//                                       "estimated_duration_seconds": 913,
//                                       "estimated_distance_miles": 3.29,
//                                       "estimated_cost_cents_max": 475,
//                                       "primetime_percentage": "0%",
//                                       "currency": "USD",
//                                       "estimated_cost_cents_min": 475,
//                                       "display_name": "Lyft Line",
//                                       "primetime_confirmation_token": null,
//                                       "cost_token": null,
//                                       "is_valid_estimate": true
//                                     },
//                                     {
//                                       "ride_type": "lyft",
//                                       "estimated_duration_seconds": 913,
//                                       "estimated_distance_miles": 3.29,
//                                       "estimated_cost_cents_max": 1755,
//                                       "primetime_percentage": "25%",
//                                       "currency": "USD",
//                                       "estimated_cost_cents_min": 1052,
//                                       "display_name": "Lyft",
//                                       "primetime_confirmation_token": null,
//                                       "cost_token": null,
//                                       "is_valid_estimate": true
//                                     }
//                                   ]
//                         };
//     var lyftPrice = "$" + Math.round(lyftPriceResults.cost_estimates[0].estimated_cost_cents_min / 100) + "-" + Math.round(lyftPriceResults.cost_estimates[0].estimated_cost_cents_max / 100)
    
//     console.log( "$" + Math.round(lyftPriceResults.cost_estimates[0].estimated_cost_cents_min / 100) + "-" + Math.round(lyftPriceResults.cost_estimates[0].estimated_cost_cents_max / 100) + " dollars");
    
     
     
//  }  
    