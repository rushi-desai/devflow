import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { taskApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import type { BoardStatus, Task, User } from '../../types';
import { CheckSquare } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: number;
  initialStatus?: BoardStatus;
  members: User[];
  onTaskCreated: (task: Task) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  boardId,
  initialStatus = 'TODO',
  members,
  onTaskCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<BoardStatus>(initialStatus);
  const [assigneeId, setAssigneeId] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const task = await taskApi.create(boardId, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        assigneeId: assigneeId ? Number(assigneeId) : null
      });
      showToast('success', 'Task created', `"${task.title}" has been added`);
      onTaskCreated(task);
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setAssigneeId('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add an issue or task item to this board."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Implement JWT authentication middleware"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          leftIcon={<CheckSquare className="w-4 h-4" />}
          error={error}
          autoFocus
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Add detailed task specifications, requirements, or links..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status selector */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BoardStatus)}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3.5 py-2.5 outline-none"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Assignee selector */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3.5 py-2.5 outline-none"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
