import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { boardApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Kanban } from 'lucide-react';
import type { Board } from '../../types';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onBoardCreated: (board: Board) => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onBoardCreated
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Board name is required');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const board = await boardApi.create(projectId, name.trim());
      showToast('success', 'Board created', `"${board.name}" is now available`);
      onBoardCreated(board);
      setName('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create board');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Board"
      description="Add a new Kanban board to track tasks for this project."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Board Name"
          placeholder="e.g. Sprint 1, Bugs & Fixes, Backlog"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          leftIcon={<Kanban className="w-4 h-4" />}
          error={error}
          autoFocus
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Board
          </Button>
        </div>
      </form>
    </Modal>
  );
};
