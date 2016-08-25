(function() {
  // Check for IE9+
  if (!window.addEventListener) return

  const CALLBACK_NAME = "EagerForecastOnload"
  const GOOGLE_KEY = "AIzaSyDHXsFL-DHAedbPM9V032TdzexEJ10ysOo"
  const CONTAINER_HEIGHT = 245
  const PLACEHOLDER_ADDRESS = "1 Broadway Cambridge, MA 02142"
  const RATE_LIMIT = 1500

  let rateTimeout
  let element
  let script
  let options = INSTALL_OPTIONS
  const iframe = Object.assign(document.createElement("iframe"), {
    type: "text/html",
    frameBorder: "0",
    height: CONTAINER_HEIGHT,
    seamless: "seamless",
    width: "100%"
  })

  function updateElement() {
    const {colors, units} = options
    const address = options.address.trim() || PLACEHOLDER_ADDRESS
    const {Geocoder, GeocoderStatus} = window.google.maps
    const geocoder = new Geocoder()

    element = Eager.createElement(options.element, element)
    element.className = "eager-forecast"
    element.style.height = `${CONTAINER_HEIGHT}px`

    geocoder.geocode({address}, (results, status) => {
      if (status !== GeocoderStatus.OK) {
        element.setAttribute("data-status", "error")
        element.textContent = `Could not find the address, "${address}"`
        return
      }

      const {formatted_address, geometry: {location: {lat, lng}}} = results[0]
      const [city, stateAndZip = ""] = formatted_address.split(", ")
      const [state] = stateAndZip.split(" ")
      const name = state ? `${city}, ${state}` : city

      iframe.src = `https://forecast.io/embed/#lat=${lat()}&lon=${lng()}&name=${encodeURIComponent(name)}&color=${colors.tempColor}&units=${units}`
      iframe.style.backgroundColor = colors.enableBackgroundColor ? colors.backgroundColor : ""

      element.appendChild(iframe)
    })
  }

  function updateScript() {
    script = document.createElement("script")
    script.type = "text/javascript"
    script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${GOOGLE_KEY}&callback=${CALLBACK_NAME}`

    document.body.appendChild(script)
  }

  window[CALLBACK_NAME] = updateElement

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateScript)
  }
  else {
    updateScript()
  }


  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setOptions(nextOptions) {
      clearTimeout(rateTimeout)
      options = nextOptions

      if (!window.google.maps) return updateScript()

      // Rapid requests are rejected by Google and must be limited.
      rateTimeout = setTimeout(updateElement, RATE_LIMIT)
    }
  }
}())
