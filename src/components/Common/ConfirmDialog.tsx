import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

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
  loading = false,
}: ConfirmDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: 'text-red-500',
          bgColor: 'bg-red-600/10',
          borderColor: 'border-red-600/20',
          buttonVariant: 'danger' as const,
        };
      case 'warning':
        return {
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-600/10',
          borderColor: 'border-amber-600/20',
          buttonVariant: 'primary' as const,
        };
      case 'info':
        return {
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-600/10',
          borderColor: 'border-blue-600/20',
          buttonVariant: 'primary' as const,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      preventClose={loading}
    >
      <div className="space-y-4">
        <div className={`flex items-start gap-3 p-4 ${styles.bgColor} ${styles.borderColor} border rounded-lg`}>
          <AlertTriangle className={`w-5 h-5 ${styles.iconColor} mt-0.5 flex-shrink-0`} />
          <p className="text-slate-300">{message}</p>
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
            variant={styles.buttonVariant}
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