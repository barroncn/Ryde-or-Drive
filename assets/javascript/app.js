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

var samplePriceResultsUber = {
    "prices": [
        {
            "localized_display_name": "SELECT",
            "distance": 6.25,
            "display_name": "SELECT",
            "product_id": "57c0ff4e-1493-4ef9-a4df-6b961525cf92",
            "high_estimate": 39,
            "low_estimate": 31,
            "duration": 1140,
            "estimate": "$31-39",
            "currency_code": "USD"
        },
        {
            "localized_display_name": "uberXL",
            "distance": 6.25,
            "display_name": "uberXL",
            "product_id": "821415d8-3bd5-4e27-9604-194e4359a449",
            "high_estimate": 27,
            "low_estimate": 21,
            "duration": 1140,
            "estimate": "$21-27",
            "currency_code": "USD"
        },
        {
            "localized_display_name": "BLACK",
            "distance": 6.25,
            "display_name": "BLACK",
            "product_id": "d4abaae7-f4d6-4152-91cc-77523e8165a4",
            "high_estimate": 50,
            "low_estimate": 40,
            "duration": 1140,
            "estimate": "$40-50",
            "currency_code": "USD"
        },
        {
            "localized_display_name": "SUV",
            "distance": 6.25,
            "display_name": "SUV",
            "product_id": "8920cb5e-51a4-4fa4-acdf-dd86c5e18ae0",
            "high_estimate": 63,
            "low_estimate": 51,
            "duration": 1140,
            "estimate": "$51-63",
            "currency_code": "USD"
        },
        {
            "localized_display_name": "ASSIST",
            "distance": 6.25,
            "display_name": "ASSIST",
            "product_id": "ff5ed8fe-6585-4803-be13-3ca541235de3",
            "high_estimate": 21,
            "low_estimate": 16,
            "duration": 1140,
            "estimate": "$16-21",
            "currency_code": "USD"
        },
        {
            "localized_display_name": "WAV",
            "distance": 6.25,
            "display_name": "WAV",
            "product_id": "2832a1f5-cfc0-48bb-ab76-7ea7a62060e7",
            "high_estimate": 21,
            "low_estimate": 16,
            "duration": 1140,
            "estimate": "$16-21",
            "currency_code": "USD"
        },
        {
            "localized_display_name": "POOL",
            "distance": 6.25,
            "display_name": "POOL",
            "product_id": "26546650-e557-4a7b-86e7-6a3942445247",
            "high_estimate": 15,
            "low_estimate": 11,
            "duration": 1140,
            "estimate": "$11-14",
            "currency_code": "USD"
        },
        {
            "localized_display_name": "uberX",
            "distance": 6.25,
            "display_name": "uberX",
            "product_id": "a1111c8c-c720-46c3-8534-2fcdd730040d",
            "high_estimate": 21,
            "low_estimate": 16,
            "duration": 1140,
            "estimate": "$16-21",
            "currency_code": "USD"
        },
        {
            "localized_display_name": "TAXI",
            "distance": 6.25,
            "display_name": "TAXI",
            "product_id": "3ab64887-4842-4c8e-9780-ccecd3a0391d",
            "high_estimate": null,
            "low_estimate": null,
            "duration": 1140,
            "estimate": "Metered",
            "currency_code": null
        }
    ]
};


var sampleTimeResultsUber = {
  "times": [
        {
            "localized_display_name": "SELECT",
            "estimate": 180,
            "display_name": "SELECT",
            "product_id": "57c0ff4e-1493-4ef9-a4df-6b961525cf92"
        },
        {
            "localized_display_name": "uberXL",
            "estimate": 480,
            "display_name": "uberXL",
            "product_id": "821415d8-3bd5-4e27-9604-194e4359a449"
        },
        {
            "localized_display_name": "BLACK",
            "estimate": 240,
            "display_name": "BLACK",
            "product_id": "d4abaae7-f4d6-4152-91cc-77523e8165a4"
        },
        {
            "localized_display_name": "SUV",
            "estimate": 240,
            "display_name": "SUV",
            "product_id": "8920cb5e-51a4-4fa4-acdf-dd86c5e18ae0"
        },
        {
            "localized_display_name": "ASSIST",
            "estimate": 540,
            "display_name": "ASSIST",
            "product_id": "ff5ed8fe-6585-4803-be13-3ca541235de3"
        },
        {
            "localized_display_name": "WAV",
            "estimate": 300,
            "display_name": "WAV",
            "product_id": "2832a1f5-cfc0-48bb-ab76-7ea7a62060e7"
        },
        {
            "localized_display_name": "POOL",
            "estimate": 60,
            "display_name": "POOL",
            "product_id": "26546650-e557-4a7b-86e7-6a3942445247"
        },
        {
            "localized_display_name": "uberX",
            "estimate": 60,
            "display_name": "uberX",
            "product_id": "a1111c8c-c720-46c3-8534-2fcdd730040d"
        },
        {
            "localized_display_name": "TAXI",
            "estimate": 480,
            "display_name": "TAXI",
            "product_id": "3ab64887-4842-4c8e-9780-ccecd3a0391d"
        }
    ]
}
 
  $("#submit").on("click", function(event){
    event.preventDefault();
    startLocation = $("#startLocation").val();
    destination = $("#destination").val();
    mpg = $("#mpg").val();
    
    if((startLocation !== "") && (destination !== "") && (mpg !== "")){
        $("#startLocation").val("");
        $("#destination").val("");
        $("#mpg").val("");
        $("#message").html("");
      }
      
    else{
      $("#message").html("Please input all information");
    }
    
  });
  
//   var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "https://api.uber.com/v1.2/estimates/price?latitude=37.7759792&longitude=-122.41823",
//   "method": "GET",
//   "headers": {
//     "authorization": "Bearer xmwkq2JJhPFoG8stW27xD4KHcKh62c_iRIKZJ19v",
//     "cache-control": "no-cache",
// //     "postman-token": "26f81f12-4a8e-46af-6e27-0ba915f1d4f1"
// }
// };

// $.ajax(settings).done(function (response) {
//   console.log(response);
// });

//This is the code Jeff is going over for the CORS issues
$.ajax({
          url: "https://api.uber.com/v1.2/estimates/time", 
          beforeSend: function(xhr) { 
            xhr.setRequestHeader("Authorization", "Token" + btoa("KA.eyJ2ZXJzaW9uIjoyLCJpZCI6InNLVFJjOGlFVFdTSFNEc24rZm5YOHc9PSIsImV4cGlyZXNfYXQiOjE1MTM1MjA5NzQsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.5Yumx3RvUwqXiRzabQnWplP1C-gl9K2ZU9WRlB2Ws4E")); 
          },
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json',
          processData: false,
          data: "start_latitude=37.7752315&start_longitude=-122.418075",
          success: function (data) {
            alert(JSON.stringify(data));
          },
          error: function(){
            alert("Cannot get data");
          }
        });