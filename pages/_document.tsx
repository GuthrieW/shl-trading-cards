import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'
import sprite from 'svg-sprite-loader/runtime/sprite.build'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    const spriteContent = sprite.stringify()

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        spriteContent,
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <title>SHL Trading Cards | Ice Level</title>
          <link href={'public/favicon.svg'} />
        </Head>
        <body style={{ margin: '0px' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
