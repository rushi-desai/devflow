import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Kanban,
  Activity,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';
import { useOrganization } from '../../context/OrganizationContext';
import { clsx } from 'clsx';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile
}) => {
  const { currentOrg } = useOrganization();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Organizations', path: '/organizations', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Projects', path: '/projects', icon: <FolderKanban className="w-4 h-4" /> },
    { label: 'Boards', path: '/boards', icon: <Kanban className="w-4 h-4" /> },
    { label: 'Activity Feed', path: '/activities', icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          'fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-[#11141b] border-r border-slate-800 transition-[width,transform] duration-200',
          isCollapsed ? 'w-16' : 'w-64',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex-1 py-5 px-2.5 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Main menu
            </p>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60',
                  isCollapsed && 'justify-center px-0'
                )
              }
              title={isCollapsed ? item.label : undefined}
            >
              <span className="shrink-0 group-hover:text-indigo-300">
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}

          {!isCollapsed && currentOrg && (
            <div className="mt-7 pt-5 border-t border-slate-800 px-1">
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 mb-2.5">
                  <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {currentOrg.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    {currentOrg.members?.length || 1} members
                  </span>
                  <span>{currentOrg.projects?.length || 0} projects</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-800 hidden md:flex items-center justify-end">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
