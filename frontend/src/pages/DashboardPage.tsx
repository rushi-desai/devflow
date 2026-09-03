import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';
import { projectApi, activityApi } from '../services/api';
import type { Project, ActivityLog } from '../types';
import { Button } from '../components/common/Button';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { CreateOrgModal } from '../components/organizations/CreateOrgModal';
import { InviteMemberModal } from '../components/organizations/InviteMemberModal';
import {
  FolderKanban,
  Kanban,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  Plus,
  Activity,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { currentOrg, reloadOrganizations } = useOrganization();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateProjModalOpen, setIsCreateProjModalOpen] = useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        if (currentOrg) {
          const projs = await projectApi.list(currentOrg.id);
          setProjects(projs);
        } else {
          setProjects([]);
        }

        const acts = await activityApi.list();
        setActivities(acts.slice(0, 10));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentOrg]);

  // Aggregate metrics
  let totalBoards = 0;
  let totalTasks = 0;
  let completedTasks = 0;

  projects.forEach((proj) => {
    if (proj.boards) {
      totalBoards += proj.boards.length;
      proj.boards.forEach((b) => {
        if (b.tasks) {
          totalTasks += b.tasks.length;
          completedTasks += b.tasks.filter((t) => t.status === 'DONE').length;
        }
      });
    }
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    reloadOrganizations();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {currentOrg
                ? `Managing workspace "${currentOrg.name}". Track sprints, monitor deliverables, and collaborate with your team.`
                : 'Get started by selecting or creating an organization workspace.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentOrg ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(true)}
                  leftIcon={<Users className="w-4 h-4 text-indigo-400" />}
                >
                  Add Member
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateProjModalOpen(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  New Project
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCreateOrgModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Workspace
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Metric */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Projects
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{projects.length}</span>
            <span className="text-xs text-slate-500">active</span>
          </div>
        </div>

        {/* Boards Metric */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Kanban Boards
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Kanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalBoards}</span>
            <span className="text-xs text-slate-500">boards</span>
          </div>
        </div>

        {/* Tasks Metric */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalTasks}</span>
            <span className="text-xs text-emerald-400 font-medium">
              {completedTasks} done
            </span>
          </div>
        </div>

        {/* Completion Rate Metric */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{completionRate}%</span>
            <span className="text-xs text-slate-500">overall</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-100">Active Projects</h3>
            </div>
            <Link
              to="/projects"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-center space-y-3">
              <p className="text-sm text-slate-400">No projects yet in this organization.</p>
              {currentOrg && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateProjModalOpen(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Create First Project
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => {
                let projTasks = 0;
                let projDone = 0;
                project.boards?.forEach((b) => {
                  if (b.tasks) {
                    projTasks += b.tasks.length;
                    projDone += b.tasks.filter((t) => t.status === 'DONE').length;
                  }
                });
                const percent = projTasks > 0 ? Math.round((projDone / projTasks) * 100) : 0;

                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-2xl shadow-sm transition-all duration-150 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                          {project.name}
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                          {project.boards?.length || 0} boards
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span>Progress</span>
                        <span className="font-semibold text-slate-200">
                          {projDone}/{projTasks} tasks ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent Activities */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-100">Live Activity</h3>
            </div>
            <Link
              to="/activities"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>Audit Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 max-h-[480px] overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No recent activities</p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/50 transition text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {act.user?.name ? act.user.name[0]?.toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-200">
                      <span className="font-semibold text-slate-100">
                        {act.user?.name || 'User'}
                      </span>{' '}
                      <span className="text-slate-400 font-mono text-[11px]">{act.action}</span>{' '}
                      <span className="font-semibold text-indigo-300 capitalize">
                        {act.entity}
                      </span>
                    </p>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(act.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {currentOrg && (
        <>
          <CreateProjectModal
            isOpen={isCreateProjModalOpen}
            onClose={() => setIsCreateProjModalOpen(false)}
            organizationId={currentOrg.id}
            onProjectCreated={handleProjectCreated}
          />
          <InviteMemberModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            organizationId={currentOrg.id}
          />
        </>
      )}

      <CreateOrgModal
        isOpen={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
      />
    </div>
  );
};
