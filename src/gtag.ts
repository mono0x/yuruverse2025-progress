export const GA_TRACKING_ID = "UA-171599880-1"

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  })
}

type GtagEvent = {
  action: string
  category: string
  label: string
  value: string
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (e: GtagEvent): void => {
  window.gtag("event", e.action, {
    event_category: e.category,
    event_label: e.label,
    value: e.value,
  })
}
