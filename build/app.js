"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

(function () {
  // Check for IE9+
  if (!window.addEventListener) return;

  var CALLBACK_NAME = "EagerForecastOnload";
  var CONTAINER_HEIGHT = 245;
  var PLACEHOLDER_ADDRESS = "One Broadway Cambridge, MA 02142";
  var RATE_LIMIT = 1500;

  var rateTimeout = undefined;
  var element = undefined;
  var script = undefined;
  var options = INSTALL_OPTIONS;
  var iframe = Object.assign(document.createElement("iframe"), {
    type: "text/html",
    frameBorder: "0",
    height: CONTAINER_HEIGHT,
    seamless: "seamless",
    width: "100%"
  });

  function updateElement() {
    var _options = options;
    var colors = _options.colors;
    var units = _options.units;

    var address = options.address.trim() || PLACEHOLDER_ADDRESS;
    var _window$google$maps = window.google.maps;
    var Geocoder = _window$google$maps.Geocoder;
    var GeocoderStatus = _window$google$maps.GeocoderStatus;

    var geocoder = new Geocoder();

    element = Eager.createElement(options.element, element);
    element.className = "eager-forecast";
    element.style.height = CONTAINER_HEIGHT + "px";

    geocoder.geocode({ address: address }, function (results, status) {
      if (status !== GeocoderStatus.OK) {
        element.setAttribute("data-status", "error");
        element.textContent = "Could not find the address, \"" + address + "\"";
        return;
      }

      var _results$0 = results[0];
      var formatted_address = _results$0.formatted_address;
      var _results$0$geometry$location = _results$0.geometry.location;
      var lat = _results$0$geometry$location.lat;
      var lng = _results$0$geometry$location.lng;

      var _formatted_address$split = formatted_address.split(", ");

      var _formatted_address$split2 = _slicedToArray(_formatted_address$split, 2);

      var city = _formatted_address$split2[0];
      var _formatted_address$split2$1 = _formatted_address$split2[1];
      var stateAndZip = _formatted_address$split2$1 === undefined ? "" : _formatted_address$split2$1;

      var _stateAndZip$split = stateAndZip.split(" ");

      var _stateAndZip$split2 = _slicedToArray(_stateAndZip$split, 1);

      var state = _stateAndZip$split2[0];

      var name = state ? city + ", " + state : city;

      iframe.src = "https://forecast.io/embed/#lat=" + lat() + "&lon=" + lng() + "&name=" + encodeURIComponent(name) + "&color=" + colors.tempColor + "&units=" + units;
      iframe.style.backgroundColor = colors.enableBackgroundColor ? colors.backgroundColor : "";

      element.appendChild(iframe);
    });
  }

  function updateScript() {
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&callback=" + CALLBACK_NAME;

    document.body.appendChild(script);
  }

  window[CALLBACK_NAME] = updateElement;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateScript);
  } else {
    updateScript();
  }

  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setOptions: function setOptions(nextOptions) {
      clearTimeout(rateTimeout);
      options = nextOptions;

      if (!window.google.maps) return updateScript();

      // Rapid requests are rejected by Google and must be limited.
      rateTimeout = setTimeout(updateElement, RATE_LIMIT);
    }
  };
})();