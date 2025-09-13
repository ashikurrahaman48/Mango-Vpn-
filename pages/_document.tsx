
import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <title>Mango VPN Connect</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          /* For custom scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: var(--color-bg-secondary, #1f2937);
          }
          ::-webkit-scrollbar-thumb {
            background: var(--color-bg-tertiary, #4b5563);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
          
          /* THEME VARIABLES */
          :root, [data-theme="mango"] {
            --color-primary: #f59e0b; /* amber-500 */
            --color-primary-focus: #d97706; /* amber-600 */
            --color-primary-content: #ffffff;
            --color-accent: #fbbf24; /* amber-400 */
            --color-bg-primary: #111827; /* gray-900 */
            --color-bg-secondary: #1f2937; /* gray-800 */
            --color-bg-tertiary: #374151; /* gray-700 */
            --color-text-primary: #f9fafb; /* gray-50 */
            --color-text-secondary: #d1d5db; /* gray-300 */
            --color-text-muted: #9ca3af; /* gray-400 */
            --color-success: #34d399; /* emerald-400 */
            --color-warning: #fbbf24; /* amber-400 */
            --color-error: #f87171; /* red-400 */
          }
          [data-theme="dark"] {
            --color-primary: #4f46e5; /* indigo-600 */
            --color-primary-focus: #4338ca; /* indigo-700 */
            --color-primary-content: #ffffff;
            --color-accent: #6366f1; /* indigo-500 */
            --color-bg-primary: #020617; /* slate-950 */
            --color-bg-secondary: #0f172a; /* slate-900 */
            --color-bg-tertiary: #1e293b; /* slate-800 */
            --color-text-primary: #f8fafc; /* slate-50 */
            --color-text-secondary: #e2e8f0; /* slate-200 */
            --color-text-muted: #94a3b8; /* slate-400 */
          }
          [data-theme="light"] {
            --color-primary: #0284c7; /* sky-600 */
            --color-primary-focus: #0369a1; /* sky-700 */
            --color-primary-content: #ffffff;
            --color-accent: #0ea5e9; /* sky-500 */
            --color-bg-primary: #ffffff;
            --color-bg-secondary: #f1f5f9; /* slate-100 */
            --color-bg-tertiary: #e2e8f0; /* slate-200 */
            --color-text-primary: #1e293b; /* slate-800 */
            --color-text-secondary: #334155; /* slate-700 */
            --color-text-muted: #64748b; /* slate-500 */
          }
          [data-theme="material"] {
            --color-primary: #673ab7;
            --color-primary-focus: #512da8;
            --color-primary-content: #ffffff;
            --color-accent: #7e57c2;
            --color-bg-primary: #121212;
            --color-bg-secondary: #1e1e1e;
            --color-bg-tertiary: #272727;
            --color-text-primary: #ffffff;
            --color-text-secondary: #e0e0e0;
            --color-text-muted: #a0a0a0;
          }
          [data-theme="github"] {
            --color-primary: #238636;
            --color-primary-focus: #2ea043;
            --color-primary-content: #ffffff;
            --color-accent: #3fb950;
            --color-bg-primary: #0d1117;
            --color-bg-secondary: #161b22;
            --color-bg-tertiary: #21262d;
            --color-text-primary: #c9d1d9;
            --color-text-secondary: #8b949e;
            --color-text-muted: #8b949e;
          }
          body {
            background-color: var(--color-bg-primary);
            color: var(--color-text-primary);
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
