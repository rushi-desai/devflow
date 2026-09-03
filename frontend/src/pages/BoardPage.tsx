import React, { useEffect, useState } from 'react';
import { useOrganization } from '../context/OrganizationContext';
import { projectApi, boardApi, authApi } from '../services/api';
import type { Project, Board, User } from '../types';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { CreateBoardModal } from '../components/projects/CreateBoardModal';
import { Button } from '../components/common/Button';
import { Kanban, Plus, Building2 } from 'lucide-react';

export const BoardPage: React.FC = () => {
  const { currentOrg } = useOrganization();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrgData = async () => {
      if (!currentOrg) {
        setProjects([]);
        setBoards([]);
        setSelectedBoard(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError('');
      try {
        const projs = await projectApi.list(currentOrg.id);
        setProjects(projs);

        const users = currentOrg.members?.map((m) => m.user).filter(Boolean) as User[];
        setMembers(users && users.length > 0 ? users : await authApi.getUsers());

        if (projs.length > 0) {
          const firstProj = projs[0]!;
          setSelectedProjectId(firstProj.id);

          const projBoards = await boardApi.list(firstProj.id);
          setBoards(projBoards);

          if (projBoards.length > 0) {
            setSelectedBoardId(projBoards[0]!.id);
            const fullBoard = await boardApi.getById(projBoards[0]!.id);
            setSelectedBoard(fullBoard);
          }
        }
      } catch (err: any) {
        setLoadError(err.response?.data?.message || 'Boards could not be loaded right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgData();
  }, [currentOrg]);

  const handleSelectProject = async (projId: number) => {
    setSelectedProjectId(projId);
    try {
      const projBoards = await boardApi.list(projId);
      setBoards(projBoards);
      if (projBoards.length > 0) {
        setSelectedBoardId(projBoards[0]!.id);
        const fullBoard = await boardApi.getById(projBoards[0]!.id);
        setSelectedBoard(fullBoard);
      } else {
        setSelectedBoardId(null);
        setSelectedBoard(null);
      }
    } catch (err) {
      console.error('Failed to change project', err);
    }
  };

  const handleSelectBoard = async (bId: number) => {
    setSelectedBoardId(bId);
    try {
      const fullBoard = await boardApi.getById(bId);
      setSelectedBoard(fullBoard);
    } catch (err) {
      console.error('Failed to load board', err);
    }
  };

  const handleBoardCreated = (newBoard: Board) => {
    setBoards((prev) => [...prev, newBoard]);
    setSelectedBoardId(newBoard.id);
    setSelectedBoard(newBoard);
  };

  const reloadActiveBoard = async () => {
    if (selectedBoardId) {
      const fullBoard = await boardApi.getById(selectedBoardId);
      setSelectedBoard(fullBoard);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Kanban Boards</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pick a project, then keep its work moving
          </p>
        </div>

        {selectedProjectId && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateBoardModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Board
          </Button>
        )}
      </div>

      {currentOrg && projects.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 bg-[#11141b] p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project:
            </span>
            <select
              value={selectedProjectId || ''}
              onChange={(e) => handleSelectProject(Number(e.target.value))}
              className="bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-indigo-500 outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {boards.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Board:
              </span>
              <select
                value={selectedBoardId || ''}
                onChange={(e) => handleSelectBoard(Number(e.target.value))}
                className="bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-indigo-500 outline-none font-semibold text-indigo-300"
              >
                {boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {!currentOrg ? (
        <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No active workspace</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Please select an organization to view and manage its boards.
          </p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-64 rounded-xl border border-slate-800 bg-[#11141b] p-4 animate-pulse">
              <div className="h-8 w-1/2 rounded bg-slate-800 mb-5" />
              <div className="h-16 rounded-lg bg-slate-800/70 mb-3" />
              <div className="h-16 rounded-lg bg-slate-800/70" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <div className="p-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-xl">
          <h3 className="text-sm font-semibold text-rose-200">Couldn't load boards</h3>
          <p className="text-xs text-rose-300/70 mt-2">{loadError}</p>
        </div>
      ) : !selectedBoard ? (
        <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Kanban className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No boards in this project</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create a board to track sprint items and move tasks across columns.
          </p>
          {selectedProjectId && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateBoardModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Board
            </Button>
          )}
        </div>
      ) : (
        <KanbanBoard
          board={selectedBoard}
          members={members}
          onBoardUpdated={reloadActiveBoard}
        />
      )}

      {selectedProjectId && (
        <CreateBoardModal
          isOpen={isCreateBoardModalOpen}
          onClose={() => setIsCreateBoardModalOpen(false)}
          projectId={selectedProjectId}
          onBoardCreated={handleBoardCreated}
        />
      )}
    </div>
  );
};
