"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

(function () {
  // Check for IE9+
  if (!window.addEventListener) return;

  var ELEMENT_ID = "eager_forecast_embed";
  var API_KEY = "AIzaSyDjKNETqFEaZLBOvqNUskT1jxY0Buv9VuM";

  var element = undefined;
  var options = INSTALL_OPTIONS;
  var iFrame = Object.assign(document.createElement("iFrame"), {
    id: "forecast_embed",
    type: "text/html",
    frameBorder: "0",
    height: "245",
    width: "100%"
  });

  function updateElement() {
    var _options = options;
    var font = _options.font;
    var units = _options.units;
    var _options2 = options;
    var _options2$colors = _options2.colors;
    var backgroundColor = _options2$colors.backgroundColor;
    var tempColor = _options2$colors.tempColor;

    var name = undefined;

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

          var _data$results$1$formatted_address$split = data.results[1].formatted_address.split(", ");

          var _data$results$1$formatted_address$split2 = _slicedToArray(_data$results$1$formatted_address$split, 2);

          var city = _data$results$1$formatted_address$split2[0];
          var stateAndZip = _data$results$1$formatted_address$split2[1];

          var _stateAndZip$split = stateAndZip.split(" ");

          var _stateAndZip$split2 = _slicedToArray(_stateAndZip$split, 1);

          var state = _stateAndZip$split2[0];

          name = city + ", " + state;
        } else {
          // We reached our target server, but it returned an error
          name = "Your Area";
        }
        iFrame.style.backgroundColor = backgroundColor;

        iFrame.src = "https://forecast.io/embed/#lat=" + coords.latitude + "&lon=" + coords.latitude + "&name=" + encodeURIComponent(name) + "&color=" + tempColor + "&font=" + font + "&units=" + units;
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