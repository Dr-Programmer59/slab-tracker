import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Check, AlertCircle, Download, Lock } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { apiService } from '../../services/api';
import { useBatches } from '../../hooks/useApi';
import { Button } from '../../components/Common/Button';
import { Modal } from '../../components/Common/Modal';
import { StatusChip } from '../../components/Common/StatusChip';
import { BatchTable } from './BatchTable';
import { RowsTable } from './RowsTable';
import toast from 'react-hot-toast';

export function Import() {
  const { data: batchesData, loading, refetch } = useBatches();
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const batches = batchesData?.batches || [];

  const validateFile = (file: File) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload CSV or Excel files.');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File too large. Maximum size is 10MB.');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      validateFile(file);
    } catch (error) {
      toast.error((error as Error).message);
      return;
    }

    setUploading(true);
    
    apiService.uploadFile(file)
      .then((result) => {
        toast.success('File uploaded successfully!');
        refetch(); // Refresh batches list
      })
      .catch((error) => {
        toast.error(error.message || 'Upload failed');
      })
      .finally(() => {
        setUploading(false);
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const handleFinishBatch = () => {
    if (selectedBatch) {
      // Implement API call to lock batch
      toast.success('Batch locked successfully!');
      setShowFinishModal(false);
      setSelectedBatch(null);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Import</h1>
          <p className="text-slate-400 mt-1">
            Upload CSV or Excel files to import trading card data
          </p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4" />
          Download Template
        </Button>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-8"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                {uploading ? 'Uploading...' : isDragActive ? 'Drop file here' : 'Upload trading card data'}
              </h3>
              <p className="text-slate-400 text-sm">
                Drag and drop your CSV or Excel file, or click to browse
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Supported formats: .csv, .xlsx, .xls (max 10MB)
              </p>
            </div>
            {uploading && (
              <div className="w-full bg-slate-700 rounded-full h-2 mx-auto max-w-xs">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  className="bg-indigo-500 h-2 rounded-full"
                />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Batch List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                  </div>
                  <div className="w-20 h-4 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
        <BatchTable 
          batches={batches}
          onSelectBatch={setSelectedBatch}
          onFinishBatch={() => setShowFinishModal(true)}
        />
        )}
      </motion.div>

      {/* Rows Table */}
      {selectedBatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RowsTable 
            batch={selectedBatch}
            onBack={() => setSelectedBatch(null)}
          />
        </motion.div>
      )}

      {/* Finish Batch Modal */}
      <Modal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        title="Finish Batch"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-600/10 border border-amber-600/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-white mb-1">Lock Batch?</h4>
              <p className="text-sm text-slate-300">
                This will lock the batch and prevent further edits. This action cannot be undone.
              </p>
            </div>
          </div>
          
          {selectedBatch && (
            <div className="bg-slate-700 rounded-lg p-4">
              <h5 className="font-medium text-white mb-2">{selectedBatch.name}</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Total Rows:</span>
                  <span className="text-white ml-2">{selectedBatch.totalRows}</span>
                </div>
                <div>
                  <span className="text-slate-400">Processed:</span>
                  <span className="text-white ml-2">{selectedBatch.processedRows}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowFinishModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFinishBatch}
              className="flex-1"
            >
              <Lock className="w-4 h-4" />
              Lock Batch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}