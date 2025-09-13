// admin/pages/_app.tsx
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import React from 'react';

// This is a conceptual global stylesheet. In a real Next.js app,
// you would import it like this: import '../styles/globals.css';
// For this environment, we rely on the Tailwind CDN from the main index.html.

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
