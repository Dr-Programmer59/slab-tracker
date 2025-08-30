import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false
}: ConfirmDialogProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: X,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-600/10',
          borderColor: 'border-red-600/20',
          buttonVariant: 'danger' as const
        };
      case 'info':
        return {
          icon: Check,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-600/10',
          borderColor: 'border-blue-600/20',
          buttonVariant: 'primary' as const
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-600/10',
          borderColor: 'border-amber-600/20',
          buttonVariant: 'secondary' as const
        };
    }
  };

  const config = getVariantConfig();
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} preventClose={loading}>
      <div className="space-y-4">
        <div className={`flex items-start gap-3 p-4 ${config.bgColor} border ${config.borderColor} rounded-lg`}>
          <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5`} />
          <div>
            <p className="text-sm text-slate-300">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}