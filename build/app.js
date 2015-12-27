"use strict";

(function () {
  // Check for IE9+
  if (!window.addEventListener) return;

  var ELEMENT_ID = "eager_forecast_embed";
  var API_KEY = "AIzaSyDjKNETqFEaZLBOvqNUskT1jxY0Buv9VuM";

  var element = undefined;
  var options = INSTALL_OPTIONS;
  var iFrame = document.createElement("iframe");

  function updateElement() {
    var color = options.color;
    var font = options.font;
    var units = options.units;
    var name = undefined;

    iFrame.id = "forecast_embed";
    iFrame.type = "text/html";
    iFrame.frameborder = "0";
    iFrame.height = "245";
    iFrame.width = "100%";

    navigator.geolocation.getCurrentPosition(function (_ref) {
      var coords = _ref.coords;

      element = Eager.createElement(options.element, element);
      element.id = ELEMENT_ID;

      var request = new XMLHttpRequest();

      request.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords.latitude + "," + coords.longitude + "&key=" + API_KEY, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);

          console.log(data);

          var formatted_address = data.results[1].formatted_address;

          var addressArray = formatted_address.split(" ");

          name = addressArray[0] + " " + addressArray[1];
        } else {
          // We reached our target server, but it returned an error
          name = "Your Area";
        }

        iFrame.src = "https://forecast.io/embed/#lat=" + coords.latitude + "&lon=" + coords.latitude + "&name=" + encodeURIComponent(name) + "&color=" + color + "&font=" + font + "&units=" + units;
        element.appendChild(iFrame);
      };

      request.onerror = function () {
        // There was a connection error of some sort
      };

      request.send();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement);
  } else {
    updateElement();
  }

  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setOptions: function setOptions(nextOptions) {
      options = nextOptions;

      updateElement();
    }
  };
})();