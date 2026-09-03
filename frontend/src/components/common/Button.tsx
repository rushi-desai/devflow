import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-120 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99] cursor-pointer';

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/40 shadow-sm hover:shadow-indigo-500/10',
    secondary:
      'bg-[#16181f] hover:bg-[#1f232d] text-slate-200 border border-[#272b38] hover:border-[#353b4d] shadow-sm',
    danger:
      'bg-rose-600/15 hover:bg-rose-600/25 text-rose-300 border border-rose-500/30 hover:border-rose-500/50',
    ghost:
      'bg-transparent hover:bg-[#181b22] text-slate-400 hover:text-slate-200',
    outline:
      'bg-transparent hover:bg-[#16181f] text-slate-300 border border-[#272b38] hover:border-[#353b4d]'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 font-medium',
    md: 'text-xs px-3.5 py-2 gap-2 font-medium',
    lg: 'text-sm px-4 py-2.5 gap-2.5 font-medium'
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
