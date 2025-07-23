"use client";

import React, { useState } from 'react';
import { ReviewStatus } from '@/types';
import Badge from './badge/Badge';

interface ReviewStatusSelectProps {
  currentStatus: ReviewStatus;
  reviewId: string;
  onStatusChange: (reviewId: string, newStatus: ReviewStatus, rejectionReason?: string) => Promise<void>;
  disabled?: boolean;
}

const ReviewStatusSelect: React.FC<ReviewStatusSelectProps> = ({
  currentStatus,
  reviewId,
  onStatusChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const getStatusConfig = (status: ReviewStatus) => {
    const config = {
      pending: { color: 'warning' as const, text: 'Pending' },
      with_image: { color: 'info' as const, text: 'With Image' },
      approved: { color: 'success' as const, text: 'Approved' },
      rejected: { color: 'error' as const, text: 'Rejected' }
    };
    return config[status];
  };

  const handleStatusChange = async (newStatus: ReviewStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    if (newStatus === 'rejected') {
      setShowRejectionModal(true);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const approved = newStatus === 'approved';
      await onStatusChange(reviewId, newStatus, approved ? undefined : rejectionReason);
    } catch (error) {
      console.error('Error changing status:', error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setIsLoading(true);
    try {
      await onStatusChange(reviewId, 'rejected', rejectionReason);
      setShowRejectionModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentConfig = getStatusConfig(currentStatus);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Badge variant="light" color={currentConfig.color}>
            {currentConfig.text}
          </Badge>
          {!disabled && (
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="py-1">
              {currentStatus !== 'approved' && (
                <button
                  onClick={() => handleStatusChange('approved')}
                  className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                >
                  Approve
                </button>
              )}
              {currentStatus !== 'rejected' && (
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reject Review
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                rows={3}
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRejection}
                disabled={isLoading || !rejectionReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewStatusSelect; 