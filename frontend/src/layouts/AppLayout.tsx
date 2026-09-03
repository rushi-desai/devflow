import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e13] text-slate-100">
      <Navbar onToggleSidebar={() => setIsOpenMobile((prev) => !prev)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-5 lg:p-8 bg-[#0c0e13]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
