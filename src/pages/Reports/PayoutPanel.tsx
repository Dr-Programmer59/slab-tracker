import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Check, 
  Clock, 
  User, 
  Calendar,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { Modal } from '../../components/Common/Modal';
import { PayoutStatusBadge } from '../../components/Consignment/PayoutStatusBadge';
import { usePermissions } from '../../hooks/usePermissions';
import toast from 'react-hot-toast';

// Mock payout data
const mockPayouts = [
  {
    id: '1',
    consignorName: 'John Smith',
    cardDisplayId: 'ST-2024-000123',
    cardTitle: '2023 Topps Chrome Ronald Acuña Jr.',
    salePrice: 200.00,
    payoutDue: 140.00,
    status: 'Pending' as const,
    saleDate: new Date('2024-01-15'),
  },
  {
    id: '2',
    consignorName: 'Sarah Johnson',
    cardDisplayId: 'ST-2024-000124',
    cardTitle: '2022 Panini Prizm Ja Morant',
    salePrice: 150.00,
    payoutDue: 112.50,
    status: 'Approved' as const,
    saleDate: new Date('2024-01-14'),
  },
  {
    id: '3',
    consignorName: 'John Smith',
    cardDisplayId: 'ST-2024-000125',
    cardTitle: '2021 Topps Update Vladimir Guerrero Jr.',
    salePrice: 75.00,
    payoutDue: 52.50,
    status: 'Paid' as const,
    saleDate: new Date('2024-01-10'),
    paidOn: new Date('2024-01-12'),
    reference: 'PAY-2024-001',
  },
];

export function PayoutPanel() {
  const { hasPermission } = usePermissions();
  const [payouts, setPayouts] = useState(mockPayouts);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    consignor: '',
  });
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [paidData, setPaidData] = useState({
    amount: 0,
    paidOn: new Date().toISOString().split('T')[0],
    reference: '',
  });

  const canManagePayouts = hasPermission('users.list'); // Admin/Manager only

  const filteredPayouts = payouts.filter(payout => {
    if (filters.search && !payout.consignorName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !payout.cardDisplayId.toLowerCase().includes(filters.search.toLowerCase()) &&
        !payout.cardTitle.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && payout.status !== filters.status) {
      return false;
    }
    if (filters.consignor && !payout.consignorName.toLowerCase().includes(filters.consignor.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleApprove = (payoutId: string) => {
    setPayouts(payouts.map(p => 
      p.id === payoutId 
        ? { ...p, status: 'Approved' as const }
        : p
    ));
    toast.success('Payout approved successfully!');
  };

  const handleMarkPaid = () => {
    if (!selectedPayout) return;

    setPayouts(payouts.map(p => 
      p.id === selectedPayout.id 
        ? { 
            ...p, 
            status: 'Paid' as const,
            paidOn: new Date(paidData.paidOn),
            reference: paidData.reference,
            paidAmount: paidData.amount
          }
        : p
    ));
    
    toast.success(`Payout marked as paid: $${paidData.amount}`);
    setShowMarkPaidModal(false);
    setSelectedPayout(null);
    setPaidData({
      amount: 0,
      paidOn: new Date().toISOString().split('T')[0],
      reference: '',
    });
  };

  const openMarkPaidModal = (payout: any) => {
    setSelectedPayout(payout);
    setPaidData({
      amount: payout.payoutDue,
      paidOn: new Date().toISOString().split('T')[0],
      reference: '',
    });
    setShowMarkPaidModal(true);
  };

  return (
    <div className="min-w-0 space-y-4 md:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Payout Management</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Review and process consignment payouts
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search consignor, card ID, or title..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4">
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="flex-1 sm:flex-none bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Payouts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Consignor</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Card</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Sale Price</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Payout Due</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Status</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Sale Date</th>
                {canManagePayouts && (
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.map((payout, index) => (
                <motion.tr
                  key={payout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-white font-medium">{payout.consignorName}</span>
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div>
                      <div className="text-white font-mono text-sm">{payout.cardDisplayId}</div>
                      <div className="text-slate-400 text-xs truncate max-w-[200px]">{payout.cardTitle}</div>
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <span className="text-white font-medium">${payout.salePrice.toFixed(2)}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <span className="text-green-400 font-medium">${payout.payoutDue.toFixed(2)}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <PayoutStatusBadge status={payout.status} size="sm" />
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">{payout.saleDate.toLocaleDateString()}</span>
                    </div>
                  </td>
                  {canManagePayouts && (
                    <td className="py-3 md:py-4 px-3 md:px-6">
                      <div className="flex items-center gap-2">
                        {payout.status === 'Pending' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleApprove(payout.id)}
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </Button>
                        )}
                        {payout.status === 'Approved' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openMarkPaidModal(payout)}
                          >
                            <DollarSign className="w-4 h-4" />
                            Mark Paid
                          </Button>
                        )}
                        {payout.status === 'Paid' && (
                          <span className="text-green-400 text-sm">✓ Paid</span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mark Paid Modal */}
      <Modal
        isOpen={showMarkPaidModal}
        onClose={() => {
          setShowMarkPaidModal(false);
          setSelectedPayout(null);
        }}
        title="Mark Payout as Paid"
        size="md"
      >
        {selectedPayout && (
          <div className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">{selectedPayout.consignorName}</h4>
              <div className="text-sm text-slate-400">
                <p>{selectedPayout.cardTitle}</p>
                <p>Card ID: {selectedPayout.cardDisplayId}</p>
                <p>Sale Price: ${selectedPayout.salePrice.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Paid Amount <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={paidData.amount}
                onChange={(e) => setPaidData({ ...paidData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Paid On <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={paidData.paidOn}
                onChange={(e) => setPaidData({ ...paidData, paidOn: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Reference/Note</label>
              <input
                type="text"
                value={paidData.reference}
                onChange={(e) => setPaidData({ ...paidData, reference: e.target.value })}
                placeholder="Payment reference or note"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowMarkPaidModal(false);
                  setSelectedPayout(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleMarkPaid}
                disabled={!paidData.amount || paidData.amount <= 0}
                className="flex-1"
              >
                <DollarSign className="w-4 h-4" />
                Mark as Paid
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}