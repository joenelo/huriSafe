// ======= Auto Slider ===== //
var sliderInterval;
var play = document.getElementById('play');
var pause = document.getElementById('pause');
var currentValue = range.min;

var windytyInit = {
// Required: API key
    key: 'kEjPHeD4DzTdt8j',
// Optional: Initial state of the map
    lat: 19.84772,
    lon: -61.15058,
    zoom: 5
};

function autoUpdate() {
    //clearInterval(sliderInterval);
    currentValue = +event.target.value;
    W.setTimestamp(+event.target.value);
}

function windytyMain(map) {
    var popup = L.popup()
            .setLatLng([18.48618, -61.66941])
            .setContent("<strong>Caribbean</strong>")
            .openOn( map ),
        overlays = document.getElementById('overlays'),
        levels = document.getElementById('levels'),
        state = document.getElementById('state'),
        range = document.getElementById('range');



    var metrics = ['kt','bft','m/s','mph','km/h'],
        actual = 0;

    //=== Set minimum and maximum timestamp value === //
    //===  for current overlay. Do not forget to check === //
    //===  time boundaries after changing overlay.=== //
    range.max = W.timeline.end;
    range.min = W.timeline.start;

    // Handle change of overlay
    overlays.onclick = function(event) {
        W.setOverlay(event.target.innerHTML)
    };

    // Handle change of level
    levels.onclick = function(event) {
        W.setLevel(event.target.innerHTML);
    };



    // Display actual state of a map
    W.on('redrawFinished',function( displayedParams ) {
        state.innerHTML = displayedParams.overlay + ', ' + displayedParams.level;
        state.innerHTML = new Date( displayedParams.timestamp ).toString();
    });

    setInterval(function(){
        actual++;
        if(actual > metrics.length) actual = 0;
        W.overlays.wind.setMetric( metrics[ actual ] );
    },2000);




    // ==================  add the play button and listener to start the slider ====================== //
    play.addEventListener("click", function () {
        clearInterval(sliderInterval);

        sliderInterval = setInterval(function () {
            // If it's reached the end.
            if (range.value >= range.max) {
                return;
            }

            //Find the value of the range in the slider and add its current value + extra
            range.value = parseInt(currentValue) + 5000000;
            currentValue = range.value;
            // set the timestamp inside to syncronize the slider to the time parameters
            W.setTimestamp(+currentValue);

        }, 1000);
    });
    // add a listener to pause the slider.
    pause.addEventListener("click", function() {
        clearInterval(sliderInterval);
    });





    // ================================= GET GPS DATA =====================================//
    map.on('click', function(ev) {
        console.log(ev.latlng); // ev is an event object (MouseEvent in this case)
        // add to window
        if (!window.hurisafe) {
            window.hurisafe = {}
        }
        window.hurisafe.latlong = ev.latlng;
        window.hurisafe.latitude = ev.latlng.lat;
        window.hurisafe.longitude = ev.latlng.lng;
        window.hurisafe.distanceInKm = 50;


        var content = "<a href=\"#\" id=\"showLocationListings\"> Check for Properties</a>";
        L.DomUtil.create('div', 'JOELINK', document.body);
        var popUpContent = $('.JOESLINK').html(content);

        var popup = L.popup()
            .setLatLng(ev.latlng)
            .setContent(content)
            .openOn(map);

        var element = document.getElementById("showLocationListings");
        L.DomEvent.on(element, 'click', function(event){
            var data = {
                'api_url': 'https://ws.homeaway.com/public/search',
                'params': {
                    'centerPointLongitude': window.hurisafe.longitude,
                    'centerPointLatitude': window.hurisafe.latitude,
                    'distanceInKm': window.hurisafe.distanceInKm
                }
            }
            window.hurisafe.ajaxRequest(data, "locationListings");
        });


    });
}