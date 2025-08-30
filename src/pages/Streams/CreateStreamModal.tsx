import React, { useState } from 'react';
import { Modal } from '../../components/Common/Modal';
import { Button } from '../../components/Common/Button';
import { useStreamsStore } from '../../store/streams';
import toast from 'react-hot-toast';

interface CreateStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStreamModal({ isOpen, onClose }: CreateStreamModalProps) {
  const { createStream } = useStreamsStore();
  const [formData, setFormData] = useState({
    title: '',
    streamer: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createStream({
      ...formData,
      date: new Date(formData.date),
      status: 'Draft',
      totalItems: 0,
      totalCost: 0,
    });

    toast.success('Stream created successfully!');
    onClose();
    setFormData({
      title: '',
      streamer: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Stream">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Stream Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            placeholder="e.g., February 2024 Live Break"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Streamer</label>
          <input
            type="text"
            required
            value={formData.streamer}
            onChange={(e) => setFormData({ ...formData, streamer: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            placeholder="e.g., CardBreaker Pro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Stream Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
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