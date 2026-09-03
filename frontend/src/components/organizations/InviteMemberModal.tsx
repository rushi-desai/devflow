import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useOrganization } from '../../context/OrganizationContext';
import { authApi } from '../../services/api';
import type { User } from '../../types';
import { Mail, UserPlus } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  organizationId
}) => {
  const [email, setEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addMember } = useOrganization();

  useEffect(() => {
    if (isOpen) {
      authApi.getUsers().then(setAvailableUsers).catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !selectedUserId) {
      setError('Please enter an email or select a user');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      if (selectedUserId) {
        await addMember(organizationId, { userId: Number(selectedUserId) });
      } else {
        await addMember(organizationId, { email: email.trim() });
      }
      setEmail('');
      setSelectedUserId('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member to organization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Team Member"
      description="Invite a registered colleague to join this organization."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {availableUsers.length > 0 && (
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Registered User
            </label>
            <div className="relative">
              <select
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value ? Number(e.target.value) : '');
                  if (e.target.value) setEmail('');
                  if (error) setError('');
                }}
                className="w-full bg-slate-900 text-slate-100 text-sm rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3.5 py-2.5 outline-none"
              >
                <option value="">-- Choose from existing users --</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-500 uppercase font-medium">
            Or type email
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <Input
          label="User Email"
          type="email"
          placeholder="colleague@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (e.target.value) setSelectedUserId('');
            if (error) setError('');
          }}
          leftIcon={<Mail className="w-4 h-4" />}
          error={error}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Member
          </Button>
        </div>
      </form>
    </Modal>
  );
};
