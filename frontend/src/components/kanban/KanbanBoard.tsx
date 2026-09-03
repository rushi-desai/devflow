import React, { useState } from 'react';
import type { Board, Task, BoardStatus, User } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskModal } from './TaskModal';
import { taskApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Search } from 'lucide-react';
import { Button } from '../common/Button';

interface KanbanBoardProps {
  board: Board;
  members: User[];
  onBoardUpdated?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ board, members, onBoardUpdated }) => {
  const [tasks, setTasks] = useState<Task[]>(board.tasks || []);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState<BoardStatus>('TODO');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const { showToast } = useToast();

  React.useEffect(() => {
    setTasks(board.tasks || []);
  }, [board.tasks]);

  const handleStatusChange = async (taskId: number, newStatus: BoardStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskApi.update(board.id, taskId, { status: newStatus });
      showToast('success', 'Status updated', `Moved to ${newStatus.replace('_', ' ')}`);
      if (onBoardUpdated) onBoardUpdated();
    } catch (err: any) {
      showToast('error', 'Status update failed', err.response?.data?.message || 'Update failed');
      if (board.tasks) setTasks(board.tasks);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
    if (onBoardUpdated) onBoardUpdated();
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask);
    if (onBoardUpdated) onBoardUpdated();
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    if (onBoardUpdated) onBoardUpdated();
  };

  const openCreateModal = (status: BoardStatus) => {
    setCreateStatus(status);
    setIsCreateModalOpen(true);
  };

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAssignee =
      selectedAssignee === 'all'
        ? true
        : selectedAssignee === 'unassigned'
        ? !task.assigneeId
        : String(task.assigneeId) === selectedAssignee;

    return matchesSearch && matchesAssignee;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = filteredTasks.filter((t) => t.status === 'DONE');

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Board Controls & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#11141b] p-3 rounded-xl border border-slate-800">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0e13] text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none transition"
            />
          </div>

          {/* Assignee filter */}
          <div className="relative">
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="bg-[#0c0e13] text-slate-300 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Create Task Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => openCreateModal('TODO')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 items-start">
        <KanbanColumn
          status="TODO"
          title="To Do"
          tasks={todoTasks}
          onTaskClick={openTaskModal}
          onAddTask={openCreateModal}
          onStatusChange={handleStatusChange}
          members={members}
        />

        <KanbanColumn
          status="IN_PROGRESS"
          title="In Progress"
          tasks={inProgressTasks}
          onTaskClick={openTaskModal}
          onAddTask={openCreateModal}
          onStatusChange={handleStatusChange}
          members={members}
        />

        <KanbanColumn
          status="DONE"
          title="Done"
          tasks={doneTasks}
          onTaskClick={openTaskModal}
          onAddTask={openCreateModal}
          onStatusChange={handleStatusChange}
          members={members}
        />
      </div>

      {/* Task Detail Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        boardId={board.id}
        members={members}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        boardId={board.id}
        initialStatus={createStatus}
        members={members}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};
