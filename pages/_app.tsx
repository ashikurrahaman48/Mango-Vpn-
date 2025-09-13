
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import AdminLayout from '../components/admin/Layout';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';

// The global stylesheet is loaded via the Tailwind CDN in `pages/_document.tsx`.

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const AppContent = () => {
    // Conditionally apply the admin layout for any page under the /admin path
    if (router.pathname.startsWith('/admin')) {
      return (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      );
    }

    // Render client pages (like the homepage) without the admin layout
    return <Component {...pageProps} />;
  };

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default MyApp;
