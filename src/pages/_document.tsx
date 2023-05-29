import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
          <meta charSet='UTF-8' />
          <title>Photo detective</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Slab" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
