import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layers, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0c0e13] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="hidden lg:flex lg:w-[43%] bg-[#11141b] p-10 xl:p-14 flex-col justify-between border-r border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-950/40">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">DevFlow</h1>
            <p className="text-xs text-slate-500">Projects, without the busywork.</p>
          </div>
        </div>

        <div className="max-w-md my-auto space-y-7">
          <div className="inline-flex items-center gap-2 text-xs text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>A calmer place to plan work</span>
          </div>

          <h2 className="text-3xl font-semibold text-white leading-tight">
            Keep the next step clear for everyone.
          </h2>

          <p className="text-sm text-slate-400 leading-6">
            Organize projects, move tasks across a board, and leave enough context for the person picking up the work next.
          </p>

          <div className="space-y-3">
            {[
              'Projects and shared workspaces',
              'Simple Kanban boards',
              'Comments and a useful activity trail'
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400/80 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-5 border-t border-slate-800/80">
          <span>DevFlow, 2026</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Secure sign in
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-5 sm:p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-9">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">DevFlow</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};
