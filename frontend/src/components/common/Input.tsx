import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-[11px] font-medium text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-slate-500 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={twMerge(
            clsx(
              'w-full bg-[#12141a] text-slate-100 placeholder-slate-500 text-xs rounded-lg border border-[#272b38] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition px-3 py-2 outline-none',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-rose-500/80 focus:border-rose-500',
              className
            )
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-slate-500 pointer-events-none flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-[11px] text-rose-400 font-medium mt-0.5">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={textareaId} className="text-[11px] font-medium text-slate-400">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={twMerge(
          clsx(
            'w-full bg-[#12141a] text-slate-100 placeholder-slate-500 text-xs rounded-lg border border-[#272b38] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition px-3 py-2 outline-none resize-y min-h-[85px]',
            error && 'border-rose-500/80 focus:border-rose-500',
            className
          )
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-rose-400 font-medium mt-0.5">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>}
    </div>
  );
};
