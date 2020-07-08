import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core/styles"
import Head from "next/head"
import Router from "next/router"
import React from "react"

import * as gtag from "../src/gtag"
import theme from "../src/theme"

export default function MyApp(props) {
  const { Component, pageProps } = props

  React.useEffect(() => {
    const handleRouteChange = url => {
      gtag.pageview(url)
    }
    Router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [])

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  )
}
