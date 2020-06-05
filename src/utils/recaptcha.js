import { useEffect } from 'react'

const RECAPTCHA_SITE_KEY = '6LeLuwAVAAAAABfeKRZELoGNQyX5cNY-qSJZhbiu'

// inspired from https://stackoverflow.com/a/34425083/7647005
export const useReCaptchaScript = () =>
  useEffect(() => {
    const script = document.createElement('script')

    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

export const getReCatchaToken = () =>
  new Promise(resolve =>
    window.grecaptcha.ready(function() {
      window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' }).then(function(token) {
        resolve(token)
      })
    })
  )
