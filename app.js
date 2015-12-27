(function() {
  // Check for IE9+
  if (!window.addEventListener) return

  const ELEMENT_ID = "eager_forecast_embed"
  const API_KEY = "AIzaSyDjKNETqFEaZLBOvqNUskT1jxY0Buv9VuM"

  let element
  let options = INSTALL_OPTIONS
  const iFrame = Object.assign(document.createElement("iFrame"), {
    id: "forecast_embed",
    type: "text/html",
    frameBorder: "0",
    height: "245",
    width: "100%"
  })


  function updateElement() {
    const {font, units} = options
    const {colors: {backgroundColor, tempColor}} = options
    let name

    navigator.geolocation.getCurrentPosition(({coords}) => {
      element = Eager.createElement(options.element, element)
      element.id = ELEMENT_ID

      const request = new XMLHttpRequest()

      request.open("GET", `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${API_KEY}`, true)

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          const data = JSON.parse(request.responseText)

          console.log(data)

          const [city, stateAndZip] = data.results[1].formatted_address.split(", ")
          const [state] = stateAndZip.split(" ")
          name = `${city}, ${state}`
        }
        else {
          // We reached our target server, but it returned an error
          name = "Your Area"
        }
        iFrame.style.backgroundColor = backgroundColor

        iFrame.src = `https://forecast.io/embed/#lat=${coords.latitude}&lon=${coords.latitude}&name=${encodeURIComponent(name)}&color=${tempColor}&font=${font}&units=${units}`
        element.appendChild(iFrame)
      }

      request.onerror = function() {
        // There was a connection error of some sort
      }

      request.send()
    })
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
