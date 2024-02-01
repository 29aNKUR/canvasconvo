import { Html, Main, NextScript, Head } from 'next/document';

const document = () => (
  <Html>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
<<<<<<< HEAD
        // crossOrigin="allow"
=======
        // CrossOrigin="allow"
>>>>>>> 1c59ac29bc76532f404c1a1510a0ba99f3aad29e
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
    </Head>
    <body>
      <div id="portal"></div>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default document;
