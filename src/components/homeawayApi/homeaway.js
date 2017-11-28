$( document ).ready(function() {
    if (!window.hurisafe) {
        window.hurisafe = {}
    }


    $(".listingLink").on("click",function(event){
        event.stopPropagation();
        var listingId = $(this).data("listingid");
    console.log(listingId);
        var data = {
            'api_url': 'https://ws.homeaway.com/public/listing',
            'params': {
                'id': listingId,
                'q1': 'PHOTOS',
                'q2': 'DETAILS'
            }
        }
        ajaxRequest(data);
    });

    window.hurisafe.ajaxRequest = function(data, requestType){
        jQuery.ajax({
            url: '/huriSafe/HomeAway-Ajax.php',
            type: 'POST',
            dataType: 'json',
            data: data
        }).done(function(response) {
            // your good stuff here.
            if (response.response.entries.length === 0) {
                alert("No properties found in this location, Please try another location.");
            }
            if (requestType == "locationListings") {
                window.hurisafe.processLocationListings(response);
            }
        }).fail( function(error) {
            // errors happen here.

        });
    }

    window.hurisafe.processLocationListings = function(response){
        console.log(response);
        var entries = response.response.entries;

        // Clear previous results.
        $("#homeaway").empty();
        jQuery.each(entries, function(i) {

            //================= Grab data from API and store them as variables ==========================/
            var secureUri = $(this)[0].thumbnail.secureUri;
            var listingID = $(this)[0].listingId;
            var accomodations = $(this)[0].accommodations;
            var headline = $(this)[0].headline;
            var currencyType = $(this)[0].priceRanges[0].currencyUnits;
            var priceHigh = $(this)[0].priceRanges[0].to;
            var priceLow = $(this)[0].priceRanges[0].from;
            var city = $(this)[0].location.city;
            var state = $(this)[0].location.state;
            var country = $(this)[0].location.country;
            var listingURL = $(this)[0].listingUrl;

            //================= Create the wrapper div for all the API data items.=================/
            var divCell = $("<div style=\"width: 48.25%; display: inline-block; height: 200px; border-radius: 5px; background-color: rgba(245,245,245,.6); box-shadow: 0 0 .5em .5em #ADD8E6, 0 1px 6px rgba(33,33,33,.2); margin: 10px;\"></div>");
            var unorderedList = $("<ul style=\"list-style: none; display: inline-block; width: 67%; padding-top: 10px; font-family: 'Nobile', Helvetica, Arial, sans-serif;\n\"></ul>");


            //================= Create HTML for each API data piece. ==========================/
            // Image.
            var image = $("<img style='width: 33%; height: 100%; display: inline-block; vertical-align: top; ' id='image" + i + "'>");
            image.attr("src", secureUri);
            divCell.append(image);

            //======================== Headline Info ====================//
            var aTag = $("<a target=\"_blank>\"</a>");
            aTag.attr("href", listingURL);
            var headlineInfo = $("<li style=' width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; font-size: 1.5em; line-height: 2; font-family:'Newton', Helvetica, Arial, sans-serif;\n'></li>");
            aTag.html(headline);
            headlineInfo.html(aTag);
            unorderedList.append(headlineInfo);

            //======================== Listing ID.=====================//
            var listingIdView = $("<li></li>");
            listingIdView.html("Listing ID: " + listingID);
            unorderedList.append(listingIdView);

            //================= Accomidation Info =======================//
            var accomodationInfo = $("<li style='line-height: 2'></li>");
            accomodationInfo.html("Accomodations: " + accomodations);
            unorderedList.append(accomodationInfo);

            //================= Location information ===================//
            var location = $("<li></li>");
            location.html("Location: " + city + ", " + state + ", " + country);
            unorderedList.append(location);

            //================= Price view ====================//
            var priceView = $("<li style=' padding-top: 45px;  font-size: 1.5em  '></li>");
            priceView.html(currencyType + ": $" + priceHigh + " - $" + priceLow);
            unorderedList.append(priceView);

            //================= Append the HTML API data piece to the main div ===================//
            divCell.append(unorderedList);
            $("#homeaway").append(divCell);
        })
    }

    $("#showLocationListings").on("click",function(event){
        event.stopPropagation();
        var data = {
            'api_url': 'https://ws.homeaway.com/public/search',
            'params': {
                'centerPointLongitude': window.hurisafe.longitude,
                'centerPointLatitude': window.hurisafe.latitude,
                'distanceInKm': window.hurisafe.distanceInKm
            }
        }

    });

});


