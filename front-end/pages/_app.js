import App from 'next/app'
import React from 'react'
import withReduxStore from '../redux/withReduxStore'
import { Provider } from 'react-redux'
import Layout from '../components/Layout'
import actions from '../redux/actions/authActions'
import "typeface-nunito-sans"
import "typeface-roboto"
import "../styles/global.scss"
import { PersistGate } from 'redux-persist/integration/react';

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props

    return (
      <Provider store={reduxStore}>
        <PersistGate persistor={reduxStore.__PERSISTOR} loading={null}>
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </PersistGate>
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
