import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  activeModule?: 'dashboard' | 'simulator' | 'financial' | 'budget' | 'learning';
  onModuleChange?: (module: 'dashboard' | 'simulator' | 'financial' | 'budget' | 'learning') => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeModule = 'dashboard',
  onModuleChange 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation 
        activeModule={activeModule}
        onModuleChange={onModuleChange}
      />
      <main className="px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;