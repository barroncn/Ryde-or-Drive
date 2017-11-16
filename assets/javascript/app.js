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
  
  
  