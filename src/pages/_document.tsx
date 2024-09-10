import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo_mobile.svg" />
      </Head>
      <body className="bg-bg-primary-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
