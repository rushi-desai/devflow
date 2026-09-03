import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '../context/OrganizationContext';
import { projectApi } from '../services/api';
import type { Project } from '../types';
import { Button } from '../components/common/Button';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { CreateOrgModal } from '../components/organizations/CreateOrgModal';
import {
  FolderKanban,
  Plus,
  Search,
  CheckCircle2,
  ArrowRight,
  Building2
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { currentOrg } = useOrganization();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateProjModalOpen, setIsCreateProjModalOpen] = useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentOrg) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError('');
      try {
        const data = await projectApi.list(currentOrg.id);
        setProjects(data);
      } catch (err: any) {
        setLoadError(err.response?.data?.message || 'Projects could not be loaded right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentOrg]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">
            {currentOrg
              ? `Projects under ${currentOrg.name}`
              : 'Select an organization to manage projects'}
          </p>
        </div>

        {currentOrg ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateProjModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Project
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateOrgModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Organization
          </Button>
        )}
      </div>

      {currentOrg && (
        <div className="flex items-center justify-between gap-4 bg-[#11141b] p-3 rounded-xl border border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:block">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
      )}

      {!currentOrg ? (
        <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No active workspace</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Please choose an organization from the workspace switcher or create a new one.
          </p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-56 rounded-xl border border-slate-800 bg-[#11141b] p-5 animate-pulse">
              <div className="h-9 w-9 rounded-lg bg-slate-800 mb-5" />
              <div className="h-4 w-2/3 rounded bg-slate-800 mb-3" />
              <div className="h-3 w-full rounded bg-slate-800/70 mb-2" />
              <div className="h-3 w-4/5 rounded bg-slate-800/70" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <div className="p-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-xl">
          <h3 className="text-sm font-semibold text-rose-200">Couldn't load projects</h3>
          <p className="text-xs text-rose-300/70 mt-2">{loadError}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No projects match your search query.'
              : 'Create a project to start planning boards and assigning development tasks.'}
          </p>
          {!searchQuery && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateProjModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            let totalTasks = 0;
            let doneTasks = 0;

            project.boards?.forEach((b) => {
              if (b.tasks) {
                totalTasks += b.tasks.length;
                doneTasks += b.tasks.filter((t) => t.status === 'DONE').length;
              }
            });

            const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl shadow-sm transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/80 text-slate-300 font-medium">
                      {project.boards?.length || 0} boards
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors mb-1.5">
                    {project.name}
                  </h3>

                  {project.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {doneTasks}/{totalTasks} tasks done
                    </span>
                    <span className="font-semibold text-slate-200">{percent}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium">
                      Open Kanban <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {currentOrg && (
        <CreateProjectModal
          isOpen={isCreateProjModalOpen}
          onClose={() => setIsCreateProjModalOpen(false)}
          organizationId={currentOrg.id}
          onProjectCreated={handleProjectCreated}
        />
      )}

      <CreateOrgModal
        isOpen={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
      />
    </div>
  );
};
