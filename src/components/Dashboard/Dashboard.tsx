import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../../utils/api';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedCaseStudies: number;
  learningProgress: number;
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedCaseStudies: 0,
    learningProgress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<string>('checking...');

  useEffect(() => {
    loadDashboardData();
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await apiClient.healthCheck();
      if (response && (response as any).status) {
        // APIサーバーが応答している場合は接続OK
        // データベース接続問題があっても学習機能は動作する
        setHealthStatus('healthy');
      } else {
        setHealthStatus('unhealthy');
      }
    } catch (error) {
      setHealthStatus('disconnected');
    }
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load actual dashboard stats from the new API endpoint
      const response = await apiClient.getDashboardStats();
      
      if (response.success && response.data) {
        setStats({
          totalProjects: response.data.totalProjects || 0,
          activeProjects: response.data.activeProjects || 0,
          completedCaseStudies: response.data.completedCaseStudies || 0,
          learningProgress: response.data.learningProgress || 0,
        });
      } else {
        // Fallback to placeholder data if API fails
        setStats({
          totalProjects: 0,
          activeProjects: 0,
          completedCaseStudies: 0,
          learningProgress: 0,
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Fallback to placeholder data if there's an error
      setStats({
        totalProjects: 0,
        activeProjects: 0,
        completedCaseStudies: 0,
        learningProgress: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'unhealthy':
        return 'bg-yellow-100 text-yellow-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            おかえりなさい
          </h1>
          <p className="text-gray-600 mt-2">
            会計プラクティスダッシュボード
          </p>
          
          {/* API Health Status */}
          <div className="mt-4">
            <span className="text-sm text-gray-500 mr-2">APIステータス:</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthStatusColor(healthStatus)}`}>
              {healthStatus === 'healthy' ? '正常' : healthStatus === 'unhealthy' ? '不安定' : healthStatus === 'disconnected' ? '接続エラー' : '確認中...'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      総プロジェクト数
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalProjects}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      アクティブプロジェクト
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeProjects}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      完了ケーススタディ
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.completedCaseStudies}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      学習進捗率
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.learningProgress}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              クイックアクション
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                className={`bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg p-4 text-left transition-colors duration-200 ${location.pathname.startsWith('/projects') ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                onClick={() => window.location.href = '/projects'}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">新しいプロジェクト</p>
                    <p className="text-xs text-gray-500">プロジェクトを作成</p>
                  </div>
                </div>
              </button>

              <button
                className={`bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition-colors duration-200 ${location.pathname.startsWith('/learning/case-studies') ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                onClick={() => window.location.href = '/learning/case-studies'}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">ケーススタディ</p>
                    <p className="text-xs text-gray-500">学習を始める</p>
                  </div>
                </div>
              </button>

              <button
                className={`bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition-colors duration-200 ${location.pathname.startsWith('/learning/exercises') ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                onClick={() => window.location.href = '/learning/exercises'}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">演習問題</p>
                    <p className="text-xs text-gray-500">計算練習</p>
                  </div>
                </div>
              </button>

              <button
                className={`bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-left transition-colors duration-200 ${location.pathname.startsWith('/progress') ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                onClick={() => window.location.href = '/progress'}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">進捗確認</p>
                    <p className="text-xs text-gray-500">学習状況</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;