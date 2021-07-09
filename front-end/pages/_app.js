import App from 'next/app'
import React from 'react'
import withReduxStore from '../redux/withReduxStore'
import { Provider } from 'react-redux'
import Layout from '../components/Layout'
import actions from '../redux/actions/blockActions'
import "typeface-nunito-sans"
import "typeface-roboto"
import "../styles/global.scss"
import { PersistGate } from 'redux-persist/integration/react';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    await ctx.reduxStore.dispatch(actions.fetchBlocks())
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }
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
