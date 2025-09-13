// admin/components/Layout.tsx
import React, { useState } from 'react';
// In a real Next.js app, you'd use the Link component and useRouter hook.
// Since we can't import 'next/link' or 'next/router', we'll simulate it with <a> tags.
// import Link from 'next/link';
// import { useRouter } from 'next/router';

const NavLink: React.FC<{ href: string; children: React.ReactNode; icon: React.ReactNode }> = ({ href, children, icon }) => {
  // const router = useRouter();
  // const isActive = router.pathname === href;
  // This is a placeholder for active link styling.
  const isActive = typeof window !== 'undefined' && window.location.pathname.endsWith(href);

  return (
    <a href={href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}>
      {icon}
      <span className="ml-3">{children}</span>
    </a>
  );
};

// Icons
const DashboardIcon = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const UsersIcon = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197" /></svg>;
const ServerIcon = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>;
const LogsIcon = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out w-64 bg-gray-800 border-r border-gray-700 p-4 z-30`}>
        <div className="flex items-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M12.832 2.523L12 2.1l-.832.423-8.583 4.363v7.324c0 4.364 3.844 8.583 8.415 9.577a.75.75 0 00.999 0c4.572-.994 8.415-5.213 8.415-9.577V6.886L12.832 2.523zM12 3.9l7.5 3.82v5.99c0 3.5-3.086 7.1-7.5 7.9-4.414-.8-7.5-4.4-7.5-7.9V7.72L12 3.9z" clipRule="evenodd" /></svg>
            <span className="ml-3 text-xl font-bold">Admin Panel</span>
        </div>
        <nav className="space-y-2">
            <NavLink href="/admin" icon={<DashboardIcon />}>Dashboard</NavLink>
            <NavLink href="/admin/users.html" icon={<UsersIcon />}>Users</NavLink>
            <NavLink href="/admin/servers.html" icon={<ServerIcon />}>Servers</NavLink>
            <NavLink href="/admin/logs.html" icon={<LogsIcon />}>Logs</NavLink>
        </nav>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-gray-800 border-b border-gray-700 p-4">
             <button onClick={() => setSidebarOpen(true)} className="text-gray-400 focus:outline-none focus:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
