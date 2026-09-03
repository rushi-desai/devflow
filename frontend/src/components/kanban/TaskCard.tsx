import React from 'react';
import type { Task, BoardStatus, User } from '../../types';
import { MessageSquare, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (taskId: number, newStatus: BoardStatus) => void;
  members?: User[];
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onStatusChange
}) => {
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const nextStatusMap: Record<BoardStatus, BoardStatus | null> = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'DONE',
    DONE: null
  };

  const nextStatus = nextStatusMap[task.status];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group relative bg-[#171a22] hover:bg-[#1b1f29] border border-slate-800 hover:border-slate-700/80 rounded-lg p-3.5 shadow-sm transition-all duration-150 cursor-pointer hover:shadow-indigo-500/5',
        task.status === 'IN_PROGRESS' && 'border-l-2 border-l-amber-400/70',
        task.status === 'DONE' && 'border-l-2 border-l-emerald-400/70'
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={clsx('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border', {
            'bg-slate-800 text-slate-300 border-slate-700': task.status === 'TODO',
            'bg-amber-500/10 text-amber-300 border-amber-500/30': task.status === 'IN_PROGRESS',
            'bg-emerald-500/10 text-emerald-300 border-emerald-500/30': task.status === 'DONE'
          })}
        >
          {task.status === 'TODO' ? 'To Do' : task.status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
        </span>

        {nextStatus && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, nextStatus);
            }}
            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 px-2 py-1 rounded-md"
            title={`Move to ${nextStatus === 'IN_PROGRESS' ? 'In Progress' : 'Done'}`}
          >
            <span>Advance</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 mb-1.5 text-left">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 text-left leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2 text-xs text-slate-400">
        {task.assignee ? (
          <div
            className="flex items-center gap-1.5"
            title={`Assigned to ${task.assignee.name} (${task.assignee.email})`}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              {getInitials(task.assignee.name)}
            </div>
            <span className="text-[11px] text-slate-300 truncate max-w-[80px]">
              {task.assignee.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <UserCheck className="w-3 h-3" />
            <span>Unassigned</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
              <MessageSquare className="w-3 h-3 text-slate-500" />
              <span>{task.comments.length}</span>
            </span>
          )}

          <span className="flex items-center gap-1 text-slate-500 text-[10px]">
            <Clock className="w-3 h-3" />
            <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
