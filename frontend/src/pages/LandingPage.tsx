import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Layers,
  MessageSquare,
  Kanban,
  Users
} from 'lucide-react';
import { Button } from '../components/common/Button';

const features = [
  {
    icon: Building2,
    title: 'Organizations & teams',
    text: 'Keep projects, people, and permissions together in one shared workspace.'
  },
  {
    icon: Kanban,
    title: 'Kanban boards',
    text: 'See what needs attention, what is moving, and what your team has finished.'
  },
  {
    icon: MessageSquare,
    title: 'Task comments',
    text: 'Leave the useful context next to the task instead of losing it in chat.'
  },
  {
    icon: Activity,
    title: 'Activity feed',
    text: 'A simple history of changes helps everyone catch up without a meeting.'
  }
];

const sampleColumns = [
  {
    name: 'To Do',
    color: 'bg-slate-500',
    cards: ['Map the first release', 'Add empty states']
  },
  {
    name: 'In Progress',
    color: 'bg-amber-400',
    cards: ['Tidy the settings page', 'Review API errors']
  },
  {
    name: 'Done',
    color: 'bg-emerald-400',
    cards: ['Set up the workspace', 'Invite the team']
  }
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c0e13] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0c0e13]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Layers className="h-4 w-4" />
            </span>
            <span className="font-semibold tracking-tight">DevFlow</span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <a
              href="#features"
              className="hidden text-sm text-slate-400 transition-colors hover:text-slate-100 sm:block"
            >
              Features
            </a>
            <Link
              to="/login"
              className="px-2 py-2 text-sm text-slate-300 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Button size="sm" onClick={() => navigate('/register')}>
              Get started
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <p className="mb-5 flex items-center gap-2 text-sm font-medium text-indigo-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              A simpler way to keep work moving
            </p>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Organize your team's work without the chaos.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              DevFlow gives small teams a clear place to plan projects, move tasks, and keep decisions close to the work.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Get started free
              </Button>
              <Link
                to="/login"
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800/60 hover:text-white"
              >
                Log in
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-500">No setup tour. Just create a workspace and start.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#11141b] p-3 shadow-2xl shadow-black/20 sm:p-4">
            <div className="flex items-center justify-between border-b border-slate-800 px-1 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Workspace</p>
                <h2 className="mt-1 text-sm font-semibold text-slate-100">Product launch</h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5" /> 6 members
              </div>
            </div>
            <div className="grid gap-3 pt-3 md:grid-cols-3">
              {sampleColumns.map((column) => (
                <div key={column.name} className="rounded-lg bg-[#0c0e13] p-2.5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${column.color}`} />
                      <span className="text-xs font-medium text-slate-300">{column.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-600">{column.cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {column.cards.map((card, index) => (
                      <div key={card} className="rounded-md border border-slate-800 bg-[#171a22] p-3">
                        <p className="text-xs leading-5 text-slate-200">{card}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="h-5 w-5 rounded-full bg-indigo-500/20 text-center text-[9px] leading-5 text-indigo-300">
                            {index === 0 ? 'AM' : 'JT'}
                          </span>
                          {index === 0 && <CheckCircle2 className="h-3.5 w-3.5 text-slate-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-slate-800/80 bg-[#10131a]">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-indigo-300">Everything in one place</p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">The useful parts of project management.</h2>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-lg border border-slate-800 bg-[#11141b] p-5 transition-colors hover:border-slate-700">
                  <Icon className="h-5 w-5 text-indigo-400" />
                  <h3 className="mt-5 text-sm font-semibold text-slate-100">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-7 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-semibold text-white">Ready to make the next sprint less messy?</h2>
              <p className="mt-2 text-sm text-slate-400">Create a workspace and bring your current project along.</p>
            </div>
            <Button size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Get started
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="h-4 w-4 text-indigo-400" />
            DevFlow
          </div>
          <div className="flex items-center gap-5">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-slate-200">
              GitHub
            </a>
            <span>DevFlow, 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};