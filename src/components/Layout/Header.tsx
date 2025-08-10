import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Finance Practice</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#simulator" className="hover:text-primary-200 transition-colors">
              シミュレータ
            </a>
            <a href="#guide" className="hover:text-primary-200 transition-colors">
              ガイド
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;