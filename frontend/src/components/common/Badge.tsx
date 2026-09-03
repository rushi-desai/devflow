import React from 'react';
import type { BoardStatus, TaskPriority } from '../../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Circle, Clock, CheckCircle2, AlertOctagon, ArrowUp, Minus, ArrowDown } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  status?: BoardStatus;
  priority?: TaskPriority;
  variant?: 'todo' | 'in_progress' | 'done' | 'default' | 'purple' | 'cyan' | 'amber' | 'urgent' | 'high' | 'medium' | 'low';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  status,
  priority,
  variant,
  size = 'md',
  className
}) => {
  let resolvedVariant = variant || 'default';
  let icon: React.ReactNode = null;

  if (status) {
    switch (status) {
      case 'TODO':
        resolvedVariant = 'todo';
        icon = <Circle className="w-3 h-3 text-slate-400 stroke-[2.5]" />;
        break;
      case 'IN_PROGRESS':
        resolvedVariant = 'in_progress';
        icon = <Clock className="w-3 h-3 text-amber-400 stroke-[2.5]" />;
        break;
      case 'DONE':
        resolvedVariant = 'done';
        icon = <CheckCircle2 className="w-3 h-3 text-emerald-400 stroke-[2.5]" />;
        break;
    }
  } else if (priority) {
    switch (priority) {
      case 'URGENT':
        resolvedVariant = 'urgent';
        icon = <AlertOctagon className="w-3 h-3 text-rose-400" />;
        break;
      case 'HIGH':
        resolvedVariant = 'high';
        icon = <ArrowUp className="w-3 h-3 text-orange-400" />;
        break;
      case 'MEDIUM':
        resolvedVariant = 'medium';
        icon = <Minus className="w-3 h-3 text-amber-400" />;
        break;
      case 'LOW':
        resolvedVariant = 'low';
        icon = <ArrowDown className="w-3 h-3 text-slate-400" />;
        break;
    }
  }

  const variants = {
    todo: 'bg-[#181a22] text-slate-300 border-[#2b3040]',
    in_progress: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    done: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    urgent: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    high: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    medium: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    low: 'bg-slate-800/80 text-slate-400 border-slate-700/60',
    purple: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    default: 'bg-[#181a22] text-slate-300 border-[#2b3040]'
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2 py-0.5 font-medium'
  };

  const formatStatus = (s: BoardStatus) => {
    switch (s) {
      case 'TODO':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      default:
        return s;
    }
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-md border select-none font-medium',
          variants[resolvedVariant as keyof typeof variants],
          sizes[size],
          className
        )
      )}
    >
      {icon}
      <span>{children || (status ? formatStatus(status) : priority ? priority : null)}</span>
    </span>
  );
};
