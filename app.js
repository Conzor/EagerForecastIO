(function() {
  // Check for IE9+
  if (!window.addEventListener) return

  const ELEMENT_ID = "eager-forecast"
  const CONTAINER_HEIGHT = 245

  let element
  let options = INSTALL_OPTIONS
  const iFrame = Object.assign(document.createElement("iFrame"), {
    id: "forecast_embed",
    type: "text/html",
    frameBorder: "0",
    height: CONTAINER_HEIGHT,
    seamless: "seamless",
    width: "100%"
  })


  function updateElement() {
    const {colors, zip, units} = options
    const font = "Helvetica"
    let name

    element = Eager.createElement(options.element, element)
    element.id = ELEMENT_ID
    element.style.height = `${CONTAINER_HEIGHT}px`

    const request = new XMLHttpRequest()

    request.open("GET", `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}`, true)

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        const data = JSON.parse(request.responseText)

        if (data.status === "OK") {
          const [city, stateAndZip] = data.results[0].formatted_address.split(", ")

          const [state] = stateAndZip.split(" ")

          name = `${city}, ${state}`
          const lat = data.results[0].geometry.location.lat
          const lon = data.results[0].geometry.location.lng

          iFrame.src = `https://forecast.io/embed/#lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&color=${colors.tempColor}&font=${font}&units=${units}`
          iFrame.style.backgroundColor = colors.enableBackgroundColor ? colors.backgroundColor : ""
          element.appendChild(iFrame)
        }
        else {
          // data.status wasn't okay

        }
      }
      else {
        // We reached our target server, but it returned an error

      }
    }


    request.onerror = function() {
        // There was a connection error of some sort
    }

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
