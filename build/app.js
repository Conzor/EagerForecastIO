"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

(function () {
  // Check for IE9+
  if (!window.addEventListener) return;

  var ELEMENT_ID = "eager-forecast";
  var CONTAINER_HEIGHT = 245;

  var element = undefined;
  var options = INSTALL_OPTIONS;
  var iFrame = Object.assign(document.createElement("iFrame"), {
    id: "forecast_embed",
    type: "text/html",
    frameBorder: "0",
    height: CONTAINER_HEIGHT,
    seamless: "seamless",
    width: "100%"
  });

  function updateElement() {
    var _options = options;
    var colors = _options.colors;
    var zip = _options.zip;
    var units = _options.units;

    var font = "Helvetica";
    var name = undefined;

    element = Eager.createElement(options.element, element);
    element.id = ELEMENT_ID;
    element.style.height = CONTAINER_HEIGHT + "px";

    var request = new XMLHttpRequest();

    request.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip, true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);

        if (data.status === "OK") {
          var _data$results$0$formatted_address$split = data.results[0].formatted_address.split(", ");

          var _data$results$0$formatted_address$split2 = _slicedToArray(_data$results$0$formatted_address$split, 2);

          var city = _data$results$0$formatted_address$split2[0];
          var stateAndZip = _data$results$0$formatted_address$split2[1];

          var _stateAndZip$split = stateAndZip.split(" ");

          var _stateAndZip$split2 = _slicedToArray(_stateAndZip$split, 1);

          var state = _stateAndZip$split2[0];

          name = city + ", " + state;
          var lat = data.results[0].geometry.location.lat;
          var lon = data.results[0].geometry.location.lng;

          iFrame.src = "https://forecast.io/embed/#lat=" + lat + "&lon=" + lon + "&name=" + encodeURIComponent(name) + "&color=" + colors.tempColor + "&font=" + font + "&units=" + units;
          iFrame.style.backgroundColor = colors.enableBackgroundColor ? colors.backgroundColor : "";
          element.appendChild(iFrame);
        } else {
          // data.status wasn't okay

        }
      } else {
          // We reached our target server, but it returned an error

        }
    };

    request.onerror = function () {
      // There was a connection error of some sort
    };

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