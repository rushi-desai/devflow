import React, { useEffect, useState } from 'react';
import { activityApi } from '../services/api';
import type { ActivityLog } from '../types';
import {
  Activity,
  CheckCircle2,
  MessageSquare,
  Building2,
  FolderKanban,
  Kanban,
  Clock,
  Search
} from 'lucide-react';
import { clsx } from 'clsx';

export const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const data = await activityApi.list();
        setActivities(data);
      } catch (err) {
        console.error('Failed to load activities', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getEntityIcon = (entity: string) => {
    switch (entity.toLowerCase()) {
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'organization':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'project':
        return <FolderKanban className="w-4 h-4 text-indigo-400" />;
      case 'board':
        return <Kanban className="w-4 h-4 text-cyan-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredActivities = activities.filter((act) => {
    const matchesEntity = filterEntity === 'all' || act.entity.toLowerCase() === filterEntity.toLowerCase();
    const matchesSearch =
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.user?.name && act.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesEntity && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Activity</h1>
        <p className="text-sm text-slate-400 mt-1">
          A running history of changes in your workspace
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#11141b] p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'task', 'comment', 'project', 'organization', 'board'].map((ent) => (
            <button
              key={ent}
              onClick={() => setFilterEntity(ent)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition capitalize whitespace-nowrap',
                filterEntity === ent
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              )}
            >
              {ent}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 rounded-lg bg-[#11141b] border border-slate-800" />
          ))}
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl space-y-3">
          <Activity className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No activity found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || filterEntity !== 'all'
              ? 'No activity matches your filters.'
              : 'Actions will appear here as you create tasks, boards, comments, and invite members.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4 text-left group">
                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500/50 flex items-center justify-center text-[10px] font-bold text-indigo-400 group-hover:border-indigo-400 group-hover:scale-110 transition-all shadow-sm">
                  {getEntityIcon(act.entity)}
                </div>

                <div className="flex-1 bg-[#11141b] hover:bg-[#171a22] border border-slate-800/80 hover:border-slate-700/80 p-4 rounded-lg transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[10px] flex items-center justify-center">
                        {getInitials(act.user?.name)}
                      </div>
                      <span className="text-xs font-bold text-slate-200">
                        {act.user?.name || 'User'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                        {act.action}
                      </span>
                      <span className="text-xs font-semibold text-indigo-300 capitalize">
                        {act.entity} #{act.entityId}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(act.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>

                  {act.metadata && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-xl mt-2 border border-slate-800/50 font-mono">
                      {typeof act.metadata === 'string'
                        ? act.metadata
                        : JSON.stringify(act.metadata, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
