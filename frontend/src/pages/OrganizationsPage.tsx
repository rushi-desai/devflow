import React, { useState } from 'react';
import { useOrganization } from '../context/OrganizationContext';
import { Button } from '../components/common/Button';
import { CreateOrgModal } from '../components/organizations/CreateOrgModal';
import { InviteMemberModal } from '../components/organizations/InviteMemberModal';
import {
  Building2,
  Users,
  Plus,
  Crown,
  UserPlus,
  Calendar
} from 'lucide-react';

export const OrganizationsPage: React.FC = () => {
  const { organizations, currentOrg, isLoadingOrgs, setCurrentOrg } = useOrganization();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inviteOrgId, setInviteOrgId] = useState<number | null>(null);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Organizations & Workspaces</h1>
          <p className="text-sm text-slate-400 mt-1">
            Keep your teams and projects in one place
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Organization
        </Button>
      </div>

      <div className="space-y-6">
        {isLoadingOrgs ? (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="h-44 rounded-xl border border-slate-800 bg-[#11141b] p-6 animate-pulse">
                <div className="h-11 w-11 rounded-xl bg-slate-800 mb-5" />
                <div className="h-4 w-1/3 rounded bg-slate-800" />
              </div>
            ))}
          </div>
        ) : organizations.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">No organizations found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create an organization to begin organizing projects, boards, and assigning tasks to teammates.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create First Workspace
            </Button>
          </div>
        ) : (
          organizations.map((org) => {
            const isActive = currentOrg?.id === org.id;

            return (
              <div
                key={org.id}
                className={`bg-slate-900/90 border rounded-2xl p-6 transition-all duration-150 ${
                  isActive
                    ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-lg shadow-md">
                      {org.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-lg font-bold text-slate-100">{org.name}</h3>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 uppercase tracking-wider">
                            Active Workspace
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-4">
                        <span>Owner: {org.owner?.name || 'Admin'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created {new Date(org.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!isActive && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCurrentOrg(org)}
                      >
                        Set as Active
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInviteOrgId(org.id)}
                      leftIcon={<UserPlus className="w-4 h-4 text-indigo-400" />}
                    >
                      Invite Member
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-400" />
                      Team Members ({org.members?.length || 1})
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {org.members?.map((member) => {
                      const memberUser = member.user;
                      const isMemberOwner = member.userId === org.ownerId;

                      return (
                        <div
                          key={member.userId}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center shrink-0">
                              {getInitials(memberUser?.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-200 truncate">
                                {memberUser?.name || 'User'}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {memberUser?.email}
                              </p>
                            </div>
                          </div>

                          {isMemberOwner ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              <Crown className="w-3 h-3" />
                              Owner
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                              Member
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreateOrgModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {inviteOrgId && (
        <InviteMemberModal
          isOpen={!!inviteOrgId}
          onClose={() => setInviteOrgId(null)}
          organizationId={inviteOrgId}
        />
      )}
    </div>
  );
};
