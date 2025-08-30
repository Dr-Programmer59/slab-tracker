import React, { useState } from 'react';
import { Modal } from '../../components/Common/Modal';
import { Button } from '../../components/Common/Button';
import { useInventoryStore } from '../../store/inventory';
import toast from 'react-hot-toast';

interface AddTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export function AddTrackingModal({ isOpen, onClose, item }: AddTrackingModalProps) {
  const { updateCard } = useInventoryStore();
  const [trackingData, setTrackingData] = useState({
    carrier: 'USPS',
    trackingNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingData.trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    updateCard(item.id, { 
      status: 'Shipped',
      // In real app, would store tracking data
    });

    toast.success(`Item shipped via ${trackingData.carrier}!`);
    onClose();
    setTrackingData({ carrier: 'USPS', trackingNumber: '' });
  };

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Tracking Information">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-700 rounded-lg p-4 mb-4">
          <p className="font-medium text-white">{item.title}</p>
          <p className="text-sm text-slate-400">{item.player} • {item.displayId}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Carrier</label>
          <select
            value={trackingData.carrier}
            onChange={(e) => setTrackingData({ ...trackingData, carrier: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="USPS">USPS</option>
            <option value="UPS">UPS</option>
            <option value="FedEx">FedEx</option>
            <option value="DHL">DHL</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tracking Number</label>
          <input
            type="text"
            required
            value={trackingData.trackingNumber}
            onChange={(e) => setTrackingData({ ...trackingData, trackingNumber: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            placeholder="Enter tracking number"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Mark as Shipped
          </Button>
        </div>
      </form>
    </Modal>
  );
}