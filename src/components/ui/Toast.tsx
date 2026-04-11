"use client";

import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-success" />,
  error: <XCircleIcon className="w-6 h-6 text-error" />,
  info: <InformationCircleIcon className="w-6 h-6 text-info" />,
};

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    if (type !== 'error') {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div className="rounded-md border border-accent/20 bg-background-light p-4 shadow-lg flex items-start gap-3 max-w-sm">
      {icons[type]}
      <p className="text-sm text-text flex-1 leading-5">{message}</p>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8 text-text-secondary hover:text-text"
        aria-label="Close"
      >
        <XCircleIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};
