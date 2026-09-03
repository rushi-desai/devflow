import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useOrganization } from '../../context/OrganizationContext';
import { Building2 } from 'lucide-react';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrgModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createOrganization } = useOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await createOrganization(name.trim());
      setName('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Organization"
      description="Workspaces let you group projects and collaborate with your team."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Organization Name"
          placeholder="e.g. Acme Engineering or Product Team"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={error}
          leftIcon={<Building2 className="w-4 h-4" />}
          autoFocus
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Organization
          </Button>
        </div>
      </form>
    </Modal>
  );
};
