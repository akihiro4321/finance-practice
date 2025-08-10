import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  activeModule?: 'dashboard' | 'simulator' | 'financial' | 'budget' | 'learning';
  onModuleChange?: (module: 'dashboard' | 'simulator' | 'financial' | 'budget' | 'learning') => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onModuleChange
}) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'ダッシュボード',
      path: '/dashboard',
      icon: '🏠',
      description: 'メインダッシュボード'
    },
    {
      id: 'simulator',
      label: 'システム開発シミュレーター',
      path: '/simulator',
      icon: '⚙️',
      description: '開発費用の会計処理を体験'
    },
    {
      id: 'financial',
      label: '財務三表ダッシュボード',
      path: '/financial',
      icon: '📊',
      description: 'P/L・B/S・C/Fの分析'
    },
    {
      id: 'budget',
      label: 'プロジェクト予算策定',
      path: '/budget',
      icon: '💰',
      description: '予算計画とROI分析'
    },
    {
      id: 'learning',
      label: '実践学習モジュール',
      path: '/learning',
      icon: '📚',
      description: 'ケーススタディと演習問題'
    }
  ];

  const getCurrentActiveModule = () => {
    const currentPath = location.pathname;
    const foundItem = navigationItems.find(item => currentPath.startsWith(item.path));
    return foundItem?.id || activeModule || 'dashboard';
  };

  const currentActiveModule = getCurrentActiveModule();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                currentActiveModule === item.id
                  ? 'border-teal-500 text-teal-600 bg-teal-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => onModuleChange?.(item.id as any)}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <div className="text-left">
                <div className={`font-medium ${
                  currentActiveModule === item.id ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  {item.label}
                </div>
                <div className={`text-xs mt-1 ${
                  currentActiveModule === item.id ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;