import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  ChevronDown,
  Building2,
  Plus,
  LogOut,
  Check,
  Menu,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { CreateOrgModal } from '../organizations/CreateOrgModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { organizations, currentOrg, setCurrentOrg } = useOrganization();
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const navigate = useNavigate();

  const orgRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (orgRef.current && !orgRef.current.contains(e.target as Node)) {
        setIsOrgDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-14 bg-[#0f1117]/95 backdrop-blur-md border-b border-[#242936] px-3 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#181b22] transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2 group mr-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white hidden sm:block">
              DevFlow
            </span>
          </Link>

          <span className="text-slate-700 hidden sm:block">/</span>

          <div className="relative" ref={orgRef}>
            <button
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#14171f] hover:bg-[#1c202a] border border-[#242937] text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="max-w-[130px] truncate">
                {currentOrg ? currentOrg.name : 'Select Workspace'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isOrgDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-56 rounded-xl bg-[#14171f] border border-[#262c3b] shadow-xl p-1.5 z-50 animate-in fade-in">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Workspaces
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => {
                        setCurrentOrg(org);
                        setIsOrgDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left hover:bg-[#1f2430] text-slate-200 transition cursor-pointer"
                    >
                      <span className="truncate font-medium">{org.name}</span>
                      {currentOrg?.id === org.id && (
                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      )}
                    </button>
                  ))}
                  {organizations.length === 0 && (
                    <p className="px-2.5 py-2 text-xs text-slate-500 italic">No workspaces found</p>
                  )}
                </div>
                <div className="border-t border-[#232836] mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsOrgDropdownOpen(false);
                      setIsCreateOrgModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-400 hover:bg-indigo-950/40 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="http://localhost:3000/docs"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg hover:bg-[#181b22] transition"
            title="Swagger API Documentation"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>API Docs</span>
          </a>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#181b22] transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#252936] border border-[#343a4c] flex items-center justify-center font-bold text-xs text-indigo-300">
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-medium text-slate-200 truncate max-w-[100px]">
                  {user?.name}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-[#14171f] border border-[#262c3b] shadow-xl p-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-[#232836]">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/organizations"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#1f2430] hover:text-white transition"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Workspace Settings</span>
                  </Link>
                </div>
                <div className="border-t border-[#232836] pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <CreateOrgModal
        isOpen={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
      />
    </>
  );
};
