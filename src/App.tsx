import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Simulator from './components/Simulator/Simulator';
import FinancialDashboard from './components/FinancialStatements/FinancialDashboard';
import BudgetPlanner from './components/Budget/BudgetPlanner';
import LearningModule from './components/Learning/LearningModule';
import CaseStudyViewer from './components/Learning/CaseStudyViewer';
import ExerciseViewer from './components/Learning/ExerciseViewer';
import ProgressDashboard from './components/Learning/ProgressDashboard';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/dashboard" 
            element={
              <Layout activeModule="dashboard" onModuleChange={() => {}}>
                <Dashboard />
              </Layout>
            } 
          />
          <Route 
            path="/simulator" 
            element={
              <Layout activeModule="simulator" onModuleChange={() => {}}>
                <Simulator />
              </Layout>
            } 
          />
          <Route 
            path="/financial" 
            element={
              <Layout activeModule="financial" onModuleChange={() => {}}>
                <FinancialDashboard />
              </Layout>
            } 
          />
          <Route 
            path="/budget" 
            element={
              <Layout activeModule="budget" onModuleChange={() => {}}>
                <BudgetPlanner />
              </Layout>
            } 
          />
          <Route 
            path="/learning" 
            element={
              <Layout activeModule="learning" onModuleChange={() => {}}>
                <LearningModule />
              </Layout>
            } 
          />
          <Route 
            path="/learning/case-studies" 
            element={
              <Layout activeModule="learning" onModuleChange={() => {}}>
                <CaseStudyViewer />
              </Layout>
            } 
          />
          <Route 
            path="/learning/exercises" 
            element={
              <Layout activeModule="learning" onModuleChange={() => {}}>
                <ExerciseViewer />
              </Layout>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <Layout activeModule="learning" onModuleChange={() => {}}>
                <ProgressDashboard />
              </Layout>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
