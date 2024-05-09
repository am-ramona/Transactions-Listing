import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="max-w-full overflow-x-hidden h-full">
      <Head />
      <body className="max-w-full overflow-x-hidden h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
