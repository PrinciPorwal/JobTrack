import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationDetails from './pages/ApplicationDetails';
import Interviews from './pages/Interviews';
import Resume from './pages/Resume';
import Modal from './components/common/Modal';
import ApplicationForm from './components/applications/ApplicationForm';
import { applicationService } from './services/api';

export default function App() {
  const location = useLocation();
  const [isGlobalAddOpen, setIsGlobalAddOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Derive title from route
  const getPageMeta = () => {
    const path = location.pathname;
    if (path === '/') {
      return {
        title: 'Executive Dashboard',
        subtitle: 'Real-time overview of your job search pipeline and upcoming rounds',
      };
    }
    if (path === '/applications') {
      return {
        title: 'Application Pipeline',
        subtitle: 'Manage and advance job opportunities across customizable stages',
      };
    }
    if (path.startsWith('/applications/')) {
      return {
        title: 'Opportunity Details',
        subtitle: 'In-depth job posting details, contact notes, and round history',
      };
    }
    if (path === '/interviews') {
      return {
        title: 'Interview Hub',
        subtitle: 'Track technical screenings, system design rounds, and 1-click joins',
      };
    }
    if (path === '/resume') {
      return {
        title: 'Master Resume',
        subtitle: 'Synced Google Drive resume ready for application submissions',
      };
    }
    return { title: 'JobTrack', subtitle: '' };
  };

  const { title, subtitle } = getPageMeta();

  const handleGlobalCreate = async (formData) => {
    try {
      setCreateLoading(true);
      await applicationService.create(formData);
      setIsGlobalAddOpen(false);
      // If we are on applications page, reload or dispatch event
      window.location.href = '/applications';
    } catch (err) {
      alert(err.message || 'Failed to create application');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Fixed Left Sidebar */}
      <Sidebar onOpenNewApp={() => setIsGlobalAddOpen(true)} />

      {/* Main Content Area (offset by 64 = 256px for sidebar) */}
      <div className="flex flex-1 flex-col pl-64 min-w-0">
        {/* Sticky Top Navbar */}
        <Navbar
          title={title}
          subtitle={subtitle}
          onOpenNewApp={() => setIsGlobalAddOpen(true)}
        />

        {/* Page Container */}
        <main className="flex-1 p-8">
          <Routes>
            <Route
              path="/"
              element={<Dashboard onOpenNewApp={() => setIsGlobalAddOpen(true)} />}
            />
            <Route
              path="/applications"
              element={
                <Applications
                  isAddModalOpen={isGlobalAddOpen}
                  setIsAddModalOpen={setIsGlobalAddOpen}
                />
              }
            />
            <Route path="/applications/:id" element={<ApplicationDetails />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/resume" element={<Resume />} />
          </Routes>
        </main>
      </div>

      {/* Global Add Application Modal */}
      <Modal
        isOpen={isGlobalAddOpen && location.pathname !== '/applications'}
        onClose={() => setIsGlobalAddOpen(false)}
        title="Add Job Application"
        description="Add a new role to your tracking pipeline."
      >
        <ApplicationForm
          onSubmit={handleGlobalCreate}
          onCancel={() => setIsGlobalAddOpen(false)}
          isLoading={createLoading}
        />
      </Modal>
    </div>
  );
}
