import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Check, AlertTriangle, Printer } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import type { Batch, CardStatus } from '../../types';
import toast from 'react-hot-toast';

interface RowsTableProps {
  batch: Batch;
  onBack: () => void;
}

const demoRows = [
  {
    id: '1',
    title: '2023 Topps Chrome',
    player: 'Ronald Acuña Jr.',
    sport: 'Baseball',
    year: 2023,
    grade: 'PSA 10',
    purchasePrice: 125.00,
    status: 'Staged' as CardStatus,
    validation: 'valid',
  },
  {
    id: '2',
    title: '2022 Panini Prizm',
    player: 'Ja Morant',
    sport: 'Basketball',
    year: 2022,
    grade: 'BGS 9.5',
    purchasePrice: 85.00,
    status: 'Arrived' as CardStatus,
    validation: 'valid',
  },
  {
    id: '3',
    title: '',
    player: 'Gunnar Henderson',
    sport: 'Baseball',
    year: 2023,
    grade: 'PSA 9',
    purchasePrice: 45.00,
    status: 'Staged' as CardStatus,
    validation: 'error',
  },
];

export function RowsTable({ batch, onBack }: RowsTableProps) {
  const [rows, setRows] = useState(demoRows);
  const [searchQuery, setSearchQuery] = useState('');

  const markArrived = async (rowId: string) => {
    const row = rows.find(r => r.id === rowId);
    if (!row) return;

    // Optimistic update
    setRows(prev => prev.map(r => 
      r.id === rowId ? { ...r, status: 'Arrived' as CardStatus } : r
    ));

    // Generate label and print
    try {
      await generateLabel(row);
      toast.success('Card marked as arrived and label printed!');
    } catch (error) {
      // Revert on error
      setRows(prev => prev.map(r => 
        r.id === rowId ? { ...r, status: 'Staged' as CardStatus } : r
      ));
      toast.error('Failed to process arrival');
    }
  };

  const generateLabel = async (row: any) => {
    // Simulate label generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app, this would generate a PDF and open print dialog
    const labelHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .label { width: 2in; height: 1in; border: 1px solid #000; padding: 8px; }
            .display-id { font-size: 16px; font-weight: bold; }
            .title { font-size: 12px; margin: 4px 0; }
            .details { font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="display-id">ST-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}</div>
            <div class="title">${row.title}</div>
            <div class="details">${row.player} • ${row.sport} • ${row.year}</div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(labelHtml);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredRows = rows.filter(row =>
    row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.player.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Back to Batches
          </Button>
          <div>
            <h3 className="text-lg font-semibold text-white">{batch.name}</h3>
            <p className="text-sm text-slate-400">
              {batch.processedRows} of {batch.totalRows} rows processed
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search rows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Rows Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Title</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Player</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Details</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Price</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Validation</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <span className="text-white font-medium">{row.title || '—'}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-300">{row.player}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm">
                    <div className="text-slate-300">{row.sport} • {row.year}</div>
                    {row.grade && <div className="text-slate-400">{row.grade}</div>}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-white font-medium">${row.purchasePrice}</span>
                </td>
                <td className="py-4 px-4">
                  <StatusChip status={row.status} />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {row.validation === 'valid' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className={`text-xs ${
                      row.validation === 'valid' ? 'text-green-400' : 'text-amber-500'
                    }`}>
                      {row.validation === 'valid' ? 'Valid' : 'Missing title'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {row.status === 'Staged' && row.validation === 'valid' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => markArrived(row.id)}
                    >
                      <Printer className="w-4 h-4" />
                      Mark Arrived
                    </Button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}