"use strict";

(function () {
  // Check for IE9+
  if (!window.addEventListener) return;

  var ELEMENT_ID = "eager_forecast_embed";

  var element = undefined;
  var options = INSTALL_OPTIONS;

  function unmountNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  function updateElement() {
    var iFrame = document.createElement("iframe");
    var color = options.color;
    var font = options.font;
    var units = options.units;
    var name = undefined;

    iFrame.id = "forecast_embed";
    iFrame.type = "text/html";
    iFrame.frameborder = "0";
    iFrame.height = "245";
    iFrame.width = "100%";

    navigator.geolocation.getCurrentPosition(function (position) {
      element = Eager.createElement(options.element, element);
      element.id = ELEMENT_ID;

      var request = new XMLHttpRequest();
      request.open('GET', "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyDjKNETqFEaZLBOvqNUskT1jxY0Buv9VuM", true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          console.log(data);
          var formatted_address = data.results[1].formatted_address;

          var addressArray = formatted_address.split(" ");
          var cityAndState = addressArray[0] + " " + addressArray[1];
          name = encodeURIComponent(cityAndState);
          iFrame.src = "https://forecast.io/embed/#lat=" + position.coords.latitude + "&lon=" + position.coords.latitude + "&name=" + name + "&color=" + color + "&font=" + font + "&units=" + units;
        } else {
          // We reached our target server, but it returned an error
          name = "Your Area";
        }
      };
      element.appendChild(iFrame);
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