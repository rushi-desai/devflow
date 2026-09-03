import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, Layers } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20">
        <Layers className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-6xl font-extrabold text-white tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        The board, project, or workspace you are looking for does not exist or has been moved.
      </p>

      <Link to="/">
        <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
