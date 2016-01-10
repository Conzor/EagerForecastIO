"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

(function () {
  // Check for IE9+
  if (!window.addEventListener) return;

  var CONTAINER_HEIGHT = 245;
  var PLACEHOLDER_ADDRESS = "One Broadway Cambridge, MA 02142";

  var element = undefined;
  var options = INSTALL_OPTIONS;
  var connectionErrorMessage = "A connection error occured while gathering location information.";
  var iframe = Object.assign(document.createElement("iframe"), {
    type: "text/html",
    frameBorder: "0",
    height: CONTAINER_HEIGHT,
    seamless: "seamless",
    width: "100%"
  });

  function renderError(message) {
    var forecastLogo = document.createElement("forecast-logo");
    var forecastError = document.createElement("forecast-error");

    forecastError.textContent = message;

    element.setAttribute("data-status", "error");
    element.appendChild(forecastLogo);
    element.appendChild(forecastError);
  }

  function updateElement() {
    var _options = options;
    var colors = _options.colors;
    var units = _options.units;

    var address = options.address.trim() || PLACEHOLDER_ADDRESS;
    var request = new XMLHttpRequest();

    element = Eager.createElement(options.element, element);
    element.className = "eager-forecast";
    element.style.height = CONTAINER_HEIGHT + "px";

    request.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address), true);

    request.onload = function onload() {
      // Target server reached but request error was received.
      if (request.status < 200 || request.status > 400) return renderError(connectionErrorMessage);

      var data = JSON.parse(request.responseText);

      // Target server reached but parameter error was received.
      if (data.status !== "OK") return renderError("Could not find the address, \"" + address + "\"");

      var _data$results$0 = data.results[0];
      var formatted_address = _data$results$0.formatted_address;
      var _data$results$0$geometry$location = _data$results$0.geometry.location;
      var lat = _data$results$0$geometry$location.lat;
      var lng = _data$results$0$geometry$location.lng;

      console.debug(data.results[0]);

      var _formatted_address$split = formatted_address.split(", ");

      var _formatted_address$split2 = _slicedToArray(_formatted_address$split, 2);

      var city = _formatted_address$split2[0];
      var _formatted_address$split2$1 = _formatted_address$split2[1];
      var stateAndZip = _formatted_address$split2$1 === undefined ? "" : _formatted_address$split2$1;

      var _stateAndZip$split = stateAndZip.split(" ");

      var _stateAndZip$split2 = _slicedToArray(_stateAndZip$split, 1);

      var state = _stateAndZip$split2[0];

      var name = state ? city + ", " + state : city;

      iframe.src = "https://forecast.io/embed/#lat=" + lat + "&lon=" + lng + "&name=" + encodeURIComponent(name) + "&color=" + colors.tempColor + "&units=" + units;
      iframe.style.backgroundColor = colors.enableBackgroundColor ? colors.backgroundColor : "";
      element.appendChild(iframe);
    };

    request.onerror = renderError.bind(null, connectionErrorMessage);

    request.send();
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