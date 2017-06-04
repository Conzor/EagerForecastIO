(function () {
  // Check for IE9+
  if (!window.addEventListener) return

  const CALLBACK_NAME = 'cloudflareAppForecastOnload'
  const GOOGLE_KEY = 'AIzaSyDdz-2sV5sm8P0s-_F_o70w_M-sTfeuABQ'
  const CONTAINER_HEIGHT = 245
  const PLACEHOLDER_ADDRESS = 'San Francisco, CA 94107'
  const RATE_LIMIT = 1500

  let rateTimeout
  let element
  let script
  let options = INSTALL_OPTIONS
  const iframe = document.createElement('iframe')

  iframe.type = 'text/html'
  iframe.frameBorder = '0'
  iframe.height = CONTAINER_HEIGHT
  iframe.seamless = 'seamless'
  iframe.width = '100%'

  function updateElement () {
    const {colors, units} = options
    const address = options.address.trim() || PLACEHOLDER_ADDRESS
    const {Geocoder, GeocoderStatus} = window.google.maps
    const geocoder = new Geocoder()

    element = INSTALL.createElement(options.element, element)
    element.className = 'cloudflare-forecast'
    element.style.height = `${CONTAINER_HEIGHT}px`

    geocoder.geocode({address}, (results, status) => {
      if (status !== GeocoderStatus.OK) {
        element.setAttribute('data-status', 'error')
        element.textContent = `Could not find the address, "${address}"`
        return
      }

      const {formatted_address, geometry: {location: {lat, lng}}} = results[0]
      const [city, stateAndZip = ''] = formatted_address.split(', ')
      const [state] = stateAndZip.split(' ')
      const name = state ? `${city}, ${state}` : city

      iframe.src = `https://forecast.io/embed/#lat=${lat()}&lon=${lng()}&name=${encodeURIComponent(name)}&color=${colors.tempColor}&units=${units}`
      iframe.style.backgroundColor = colors.enableBackgroundColor ? colors.backgroundColor : ''

      element.appendChild(iframe)
    })
  }

  function updateScript () {
    script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${GOOGLE_KEY}&callback=${CALLBACK_NAME}`

    document.body.appendChild(script)
  }

  window[CALLBACK_NAME] = updateElement

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateScript)
  } else {
    updateScript()
  }

  window.INSTALL_SCOPE = {
    setOptions (nextOptions) {
      clearTimeout(rateTimeout)
      options = nextOptions

      if (!window.google.maps) return updateScript()

      // Rapid requests are rejected by Google and must be limited.
      rateTimeout = setTimeout(updateElement, RATE_LIMIT)
    }
  }
}())
