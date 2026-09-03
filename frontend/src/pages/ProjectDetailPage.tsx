import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectApi, boardApi, authApi } from '../services/api';
import type { Project, Board, User } from '../types';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { CreateBoardModal } from '../components/projects/CreateBoardModal';
import { Button } from '../components/common/Button';
import {
  Kanban,
  ArrowLeft,
  Plus
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activeBoardId, setActiveBoardId] = useState<number | null>(null);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  const loadProjectData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const proj = await projectApi.getById(Number(projectId));
      setProject(proj);

      // Fetch org members or all users for task assignments
      if (proj.organization?.members) {
        const users = proj.organization.members
          .map((m) => m.user)
          .filter((u): u is User => Boolean(u));
        setMembers(users);
      } else {
        const allUsers = await authApi.getUsers();
        setMembers(allUsers);
      }

      // Default to first board if activeBoardId is not set
      if (proj.boards && proj.boards.length > 0) {
        const targetBoardId = activeBoardId || proj.boards[0]!.id;
        setActiveBoardId(targetBoardId);
        const boardData = await boardApi.getById(targetBoardId);
        setActiveBoard(boardData);
      } else {
        setActiveBoard(null);
      }
    } catch (err) {
      console.error('Failed to load project details', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, activeBoardId]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  const handleSelectBoard = async (boardId: number) => {
    setActiveBoardId(boardId);
    try {
      const boardData = await boardApi.getById(boardId);
      setActiveBoard(boardData);
    } catch (err) {
      console.error('Failed to load board', err);
    }
  };

  const handleBoardCreated = (newBoard: Board) => {
    if (project) {
      setProject({
        ...project,
        boards: [...(project.boards || []), newBoard]
      });
      setActiveBoardId(newBoard.id);
      setActiveBoard(newBoard);
    }
  };

  if (isLoading && !project) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-base font-semibold text-slate-200">Project not found</h3>
        <Link to="/projects">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Back to Projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                {project.organization?.name || 'Project'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{project.name}</h1>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateBoardModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Board
        </Button>
      </div>

      {project.description && (
        <p className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl leading-relaxed">
          {project.description}
        </p>
      )}

      {/* Boards Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        {project.boards && project.boards.length > 0 ? (
          project.boards.map((b) => (
            <button
              key={b.id}
              onClick={() => handleSelectBoard(b.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeBoardId === b.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>{b.name}</span>
            </button>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic py-1">No boards yet in this project.</p>
        )}
      </div>

      {/* Active Board Kanban View */}
      {activeBoard ? (
        <KanbanBoard
          board={activeBoard}
          members={members}
          onBoardUpdated={loadProjectData}
        />
      ) : (
        <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-3">
          <p className="text-sm text-slate-400">No board selected.</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateBoardModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create First Board
          </Button>
        </div>
      )}

      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        projectId={project.id}
        onBoardCreated={handleBoardCreated}
      />
    </div>
  );
};
