import React from 'react';
import { Button } from '../../components/Common/Button';
import { X } from 'lucide-react';
import type { FilterState, CardStatus } from '../../types';

interface FiltersPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClose: () => void;
}

const statusOptions: CardStatus[] = [
  'Staged', 'Arrived', 'Available', 'AllocatedToStream', 'Sold', 'ToShip', 'Packed', 'Shipped'
];

const sportOptions = ['Baseball', 'Basketball', 'Football', 'Hockey', 'Soccer', 'Pokemon'];

const ownershipOptions = ['Owned', 'Consigned'];

export function FiltersPanel({ filters, onFiltersChange, onClose }: FiltersPanelProps) {
  const clearFilters = () => {
    onFiltersChange({ 
      search: '', 
      status: undefined, 
      sport: undefined, 
      ownership: undefined,
      yearRange: undefined, 
      priceRange: undefined 
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">Status</h4>
        <div className="grid grid-cols-2 gap-2">
          {statusOptions.map(status => (
            <label key={status} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.status?.includes(status) || false}
                onChange={(e) => {
                  const currentStatus = filters.status || [];
                  const newStatus = e.target.checked
                    ? [...currentStatus, status]
                    : currentStatus.filter(s => s !== status);
                  onFiltersChange({ status: newStatus.length ? newStatus : undefined });
                }}
                className="rounded"
              />
              <span className="text-sm text-slate-300">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sport Filter */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">Sport</h4>
        <div className="grid grid-cols-2 gap-2">
          {sportOptions.map(sport => (
            <label key={sport} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.sport?.includes(sport) || false}
                onChange={(e) => {
                  const currentSport = filters.sport || [];
                  const newSport = e.target.checked
                    ? [...currentSport, sport]
                    : currentSport.filter(s => s !== sport);
                  onFiltersChange({ sport: newSport.length ? newSport : undefined });
                }}
                className="rounded"
              />
              <span className="text-sm text-slate-300">{sport}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ownership Filter */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">Ownership</h4>
        <div className="grid grid-cols-2 gap-2">
          {ownershipOptions.map(ownership => (
            <label key={ownership} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.ownership?.includes(ownership) || false}
                onChange={(e) => {
                  const currentOwnership = filters.ownership || [];
                  const newOwnership = e.target.checked
                    ? [...currentOwnership, ownership]
                    : currentOwnership.filter(o => o !== ownership);
                  onFiltersChange({ ownership: newOwnership.length ? newOwnership : undefined });
                }}
                className="rounded"
              />
              <span className="text-sm text-slate-300">{ownership}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="secondary" onClick={clearFilters} className="flex-1">
          Clear All
        </Button>
        <Button onClick={onClose} className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}