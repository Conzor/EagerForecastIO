(function() {
  // Check for IE9+
  if (!window.addEventListener) return

  const ELEMENT_ID = "eager_forecast_embed"
  const API_KEY = "AIzaSyDjKNETqFEaZLBOvqNUskT1jxY0Buv9VuM"

  let element
  let options = INSTALL_OPTIONS
  const iFrame = document.createElement("iframe")

  function updateElement() {
    const color = options.color
    const font = options.font
    const units = options.units
    let name

    iFrame.id = "forecast_embed"
    iFrame.type = "text/html"
    iFrame.frameborder = "0"
    iFrame.height = "245"
    iFrame.width = "100%"

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

          const {formatted_address} = data.results[1]
          const addressArray = formatted_address.split(" ")

          name = addressArray[0] + " " + addressArray[1]
        }
        else {
          // We reached our target server, but it returned an error
          name = "Your Area"
        }

        iFrame.src = `https://forecast.io/embed/#lat=${coords.latitude}&lon=${coords.latitude}&name=${encodeURIComponent(name)}&color=${color}&font=${font}&units=${units}`
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
