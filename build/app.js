/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = (function () { function sliceIterator (arr, i) { var _arr = []; var _n = true; var _d = false; var _e; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break } } catch (err) { _d = true; _e = err } finally { try { if (!_n && _i['return']) _i['return']() } finally { if (_d) throw _e } } return _arr } return function (arr, i) { if (Array.isArray(arr)) { return arr } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i) } else { throw new TypeError('Invalid attempt to destructure non-iterable instance') } } }());

(function () {
  // Check for IE9+
  if (!window.addEventListener) return

  var CALLBACK_NAME = 'cloudflareAppForecastOnload'
  var GOOGLE_KEY = 'AIzaSyDdz-2sV5sm8P0s-_F_o70w_M-sTfeuABQ'
  var CONTAINER_HEIGHT = 245
  var PLACEHOLDER_ADDRESS = 'San Francisco, CA 94107'
  var RATE_LIMIT = 1500

  var rateTimeout = void 0
  var element = void 0
  var script = void 0
  var options = INSTALL_OPTIONS
  var iframe = document.createElement('iframe')

  iframe.type = 'text/html'
  iframe.frameBorder = '0'
  iframe.height = CONTAINER_HEIGHT
  iframe.seamless = 'seamless'
  iframe.width = '100%'

  function updateElement () {
    var _options = options,
      colors = _options.colors,
      units = _options.units

    var address = options.address.trim() || PLACEHOLDER_ADDRESS
    var _window$google$maps = window.google.maps,
      Geocoder = _window$google$maps.Geocoder,
      GeocoderStatus = _window$google$maps.GeocoderStatus

    var geocoder = new Geocoder()

    element = INSTALL.createElement(options.element, element)
    element.className = 'cloudflare-forecast'
    element.style.height = CONTAINER_HEIGHT + 'px'

    geocoder.geocode({ address: address }, function (results, status) {
      if (status !== GeocoderStatus.OK) {
        element.setAttribute('data-status', 'error')
        element.textContent = 'Could not find the address, "' + address + '"'
        return
      }

      var _results$ = results[0],
        formatted_address = _results$.formatted_address,
        _results$$geometry$lo = _results$.geometry.location,
        lat = _results$$geometry$lo.lat,
        lng = _results$$geometry$lo.lng

      var _formatted_address$sp = formatted_address.split(', '),
        _formatted_address$sp2 = _slicedToArray(_formatted_address$sp, 2),
        city = _formatted_address$sp2[0],
        _formatted_address$sp3 = _formatted_address$sp2[1],
        stateAndZip = _formatted_address$sp3 === undefined ? '' : _formatted_address$sp3

      var _stateAndZip$split = stateAndZip.split(' '),
        _stateAndZip$split2 = _slicedToArray(_stateAndZip$split, 1),
        state = _stateAndZip$split2[0]

      var name = state ? city + ', ' + state : city

      iframe.src = 'https://forecast.io/embed/#lat=' + lat() + '&lon=' + lng() + '&name=' + encodeURIComponent(name) + '&color=' + colors.tempColor + '&units=' + units
      iframe.style.backgroundColor = colors.enableBackgroundColor ? colors.backgroundColor : ''

      element.appendChild(iframe)
    })
  }

  function updateScript () {
    script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=' + GOOGLE_KEY + '&callback=' + CALLBACK_NAME

    document.body.appendChild(script)
  }

  window[CALLBACK_NAME] = updateElement

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateScript)
  } else {
    updateScript()
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      clearTimeout(rateTimeout)
      options = nextOptions

      if (!window.google.maps) {
        return updateScript

      // Rapid requests are rejected by Google and must be limited.
      ()
      }rateTimeout = setTimeout(updateElement, RATE_LIMIT)
    }
  }
})()


/***/ })
/******/ ]);