import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Textarea } from '../common/Input';
import { Badge } from '../common/Badge';
import { taskApi, commentApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import type { Task, BoardStatus, User, Comment } from '../../types';
import { MessageSquare, Send, Trash2, Save } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  boardId: number;
  members: User[];
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: number) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  boardId,
  members,
  onTaskUpdated,
  onTaskDeleted
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<BoardStatus>('TODO');
  const [assigneeId, setAssigneeId] = useState<number | ''>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setAssigneeId(task.assigneeId || '');

      setIsLoadingComments(true);
      setCommentsError('');
      commentApi
        .list(task.id)
        .then((data) => setComments(data))
        .catch(() => setCommentsError('Comments could not be loaded.'))
        .finally(() => setIsLoadingComments(false));
    }
  }, [task]);

  if (!task) return null;

  const handleSaveChanges = async () => {
    if (!title.trim()) {
      showToast('error', 'Validation error', 'Task title cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await taskApi.update(boardId, task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        assigneeId: assigneeId ? Number(assigneeId) : null
      });

      const updatedFull: Task = {
        ...task,
        ...updated,
        comments
      };

      showToast('success', 'Task updated', 'Changes have been saved');
      onTaskUpdated(updatedFull);
    } catch (err: any) {
      showToast('error', 'Failed to update', err.response?.data?.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await taskApi.delete(boardId, task.id);
      showToast('success', 'Task deleted', 'The task was removed');
      onTaskDeleted(task.id);
      onClose();
    } catch (err: any) {
      showToast('error', 'Delete failed', err.response?.data?.message || 'Could not delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const comment = await commentApi.create(task.id, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment('');
      showToast('success', 'Comment posted');

      onTaskUpdated({
        ...task,
        comments: [...comments, comment]
      });
    } catch (err: any) {
      showToast('error', 'Comment failed', err.response?.data?.message || 'Could not post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Badge status={status} />
            <span className="text-xs text-slate-500 font-mono">TASK-{task.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveChanges}
              isLoading={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base font-semibold"
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add detailed task requirements..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-[#11141b] border border-slate-800">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BoardStatus)}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3.5 py-2 outline-none"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3.5 py-2 outline-none"
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

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-slate-200">
              Comments ({comments.length})
            </h4>
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3.5 py-2 outline-none"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingComment}
              disabled={!newComment.trim()}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Comment
            </Button>
          </form>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {isLoadingComments && (
              <div className="space-y-2 animate-pulse">
                <div className="h-10 rounded-lg bg-slate-800/70" />
                <div className="h-10 rounded-lg bg-slate-800/50" />
              </div>
            )}

            {!isLoadingComments && commentsError && (
              <p className="text-xs text-rose-300/80 py-3 text-center bg-rose-500/5 rounded-lg border border-rose-500/20">
                {commentsError}
              </p>
            )}

            {!isLoadingComments && !commentsError && comments.length === 0 && (
              <p className="text-xs text-slate-500 py-3 text-center bg-slate-950/40 rounded-lg border border-slate-800/40">
                No comments yet. Add a note for the team.
              </p>
            )}

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-left space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 flex items-center justify-center">
                      {getInitials(comment.author?.name)}
                    </div>
                    <span className="font-semibold text-slate-300">
                      {comment.author?.name || 'DevFlow User'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(comment.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 pl-7 leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
