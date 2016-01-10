(function() {
  // Check for IE9+
  if (!window.addEventListener) return

  const CONTAINER_HEIGHT = 245
  const PLACEHOLDER_ADDRESS = "One Broadway Cambridge, MA 02142"

  let element
  let options = INSTALL_OPTIONS
  const connectionErrorMessage = "A connection error occured while gathering location information."
  const iframe = Object.assign(document.createElement("iframe"), {
    type: "text/html",
    frameBorder: "0",
    height: CONTAINER_HEIGHT,
    seamless: "seamless",
    width: "100%"
  })

  function renderError(message) {
    const forecastLogo = document.createElement("forecast-logo")
    const forecastError = document.createElement("forecast-error")

    forecastError.textContent = message

    element.setAttribute("data-status", "error")
    element.appendChild(forecastLogo)
    element.appendChild(forecastError)
  }

  function updateElement() {
    const {colors, units} = options
    const address = options.address.trim() || PLACEHOLDER_ADDRESS
    const request = new XMLHttpRequest()

    element = Eager.createElement(options.element, element)
    element.className = "eager-forecast"
    element.style.height = `${CONTAINER_HEIGHT}px`

    request.open("GET", `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`, true)

    request.onload = function onload() {
      // Target server reached but request error was received.
      if (request.status < 200 || request.status > 400) return renderError(connectionErrorMessage)

      const data = JSON.parse(request.responseText)

      // Target server reached but parameter error was received.
      if (data.status !== "OK") return renderError(`Could not find the address, "${address}"`)

      const {formatted_address, geometry: {location: {lat, lng}}} = data.results[0]
      console.debug(data.results[0])
      const [city, stateAndZip = ""] = formatted_address.split(", ")
      const [state] = stateAndZip.split(" ")
      const name = state ? `${city}, ${state}` : city

      iframe.src = `https://forecast.io/embed/#lat=${lat}&lon=${lng}&name=${encodeURIComponent(name)}&color=${colors.tempColor}&units=${units}`
      iframe.style.backgroundColor = colors.enableBackgroundColor ? colors.backgroundColor : ""
      element.appendChild(iframe)
    }

    request.onerror = renderError.bind(null, connectionErrorMessage)

    request.send()
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement)
  }
  else {
    updateElement()
  }


  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setOptions(nextOptions) {
      options = nextOptions

      updateElement()
    }
  }
}())
