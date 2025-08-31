import React, { useState } from 'react';
import { Modal } from '../../components/Common/Modal';
import { Button } from '../../components/Common/Button';
import { useStreamsStore } from '../../store/streams';

interface CreateStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStreamModal({ isOpen, onClose }: CreateStreamModalProps) {
  const { createStream } = useStreamsStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetValue: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createStream(formData);
    onClose();
    setFormData({
      name: '',
      description: '',
      targetValue: 0,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Stream">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Stream Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            placeholder="e.g., February 2024 Live Break"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white resize-none"
            rows={3}
            placeholder="Optional description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Target Value</label>
          <input
            type="number"
            step="0.01"
            value={formData.targetValue}
            onChange={(e) => setFormData({ ...formData, targetValue: parseFloat(e.target.value) || 0 })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            placeholder="0.00"
          />
        </div>


        <div className="flex gap-3 pt-4">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Create Stream
          </Button>
        </div>
      </form>
    </Modal>
  );
}