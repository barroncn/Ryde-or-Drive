Gather Input
    user provides location
            ***feature - app requests approval from user to use their geolocation
    user provides destination
    user provides fuel economy
            ***feature - user provides make/model, app calls API to determind fuel economy
    app converts address to geolocation
    app determines distance
    app determines prevailing gas prices
            MVP - avg national gas price (for major cities?) is hard-coded and maintained
            ***feature - app calls on gas pricing API for dynamic pricing based on geolocation
    app calculates cost of gas
    app calls both ride share APIs (UBER and Lyft)
    app collects and stores wait times and pricing
    
Display output
    app displays cost of driving (cost of gas)
    app displays UBER and Lyft wait times and pricing estimates
    app makes suggestion based on findings OR labels options with accolades:
        "Fastest Ride Share"
        "Cheapest Ride Share"
        "Cheapest method of transportation"
    ***feature - logos are links to rideshare app or app store for rideshare


11/16
    Items for meeting with Jeff on 11/17
        -request explanation of Oauth.
        -request assistance utilizing Postman for UBER and Lyft APIs
        -be prepared to explain the MVP-version of our APP along with features
            we would like to implement.