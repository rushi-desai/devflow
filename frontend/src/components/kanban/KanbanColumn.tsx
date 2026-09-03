import React from 'react';
import type { Task, BoardStatus, User } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { clsx } from 'clsx';

interface KanbanColumnProps {
  status: BoardStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: BoardStatus) => void;
  onStatusChange: (taskId: number, newStatus: BoardStatus) => void;
  members: User[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  tasks,
  onTaskClick,
  onAddTask,
  onStatusChange,
  members
}) => {
  const columnStyles = {
    TODO: {
      border: 'border-slate-800',
      dot: 'bg-slate-400',
      headerBg: 'bg-slate-800/40',
      badgeBg: 'bg-slate-800 text-slate-300'
    },
    IN_PROGRESS: {
      border: 'border-amber-500/20',
      dot: 'bg-amber-400',
      headerBg: 'bg-amber-500/5',
      badgeBg: 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
    },
    DONE: {
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-400',
      headerBg: 'bg-emerald-500/5',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
    }
  };

  const style = columnStyles[status];

  return (
    <div
      className={clsx(
        'flex flex-col min-w-0 bg-[#11141b] rounded-xl border p-3',
        style.border
      )}
    >
      <div
        className={clsx(
          'flex items-center justify-between p-2 rounded-lg mb-3',
          style.headerBg
        )}
      >
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full shadow-sm', style.dot)} />
          <h3 className="font-semibold text-sm text-slate-100">{title}</h3>
          <span
            className={clsx(
              'text-xs px-2 py-0.5 rounded-md font-bold',
              style.badgeBg
            )}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(status)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition"
          title="Add task in this column"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto min-h-[150px] max-h-[calc(100vh-280px)] pr-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onStatusChange={onStatusChange}
            members={members}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/80 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">Nothing here yet</p>
            <button
              onClick={() => onAddTask(status)}
              className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
            >
              + Create one
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
