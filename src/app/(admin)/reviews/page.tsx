"use client";

import React, { useState, useEffect } from 'react';
import { IReview, ReviewStatus } from '@/types';
import { getReviews, getReviewsByStatus, approveReview } from '@/lib/firestore';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Select from '@/components/form/Select';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ImageModal from '@/components/ui/ImageModal';
import ReviewStatusSelect from '@/components/ui/ReviewStatusSelect';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        let reviewsData: IReview[];
        
        if (statusFilter === 'all') {
          reviewsData = await getReviews();
        } else {
          reviewsData = await getReviewsByStatus(statusFilter);
        }
        
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [statusFilter]);

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return 'N/A';
    
    let date: Date;
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
      date = (timestamp as { toDate: () => Date }).toDate();
    } else {
      date = new Date(timestamp as string);
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const getLanguageText = (language: string) => {
    const languages = {
      es: 'Español',
      en: 'English',
      pt: 'Português'
    };
    return languages[language as keyof typeof languages] || language;
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleStatusChange = async (reviewId: string, newStatus: ReviewStatus, language: string, rejectionReason?: string) => {
    try {
      const approved = newStatus === 'approved';
      await approveReview(reviewId, approved, language, rejectionReason);
      
      // Refresh the reviews list
      const fetchReviews = async () => {
        try {
          setLoading(true);
          let reviewsData: IReview[];
          
          if (statusFilter === 'all') {
            reviewsData = await getReviews();
          } else {
            reviewsData = await getReviewsByStatus(statusFilter);
          }
          
          setReviews(reviewsData);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    } catch (error) {
      console.error('Error changing review status:', error);
      alert('Error changing review status. Please try again.');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'with_image', label: 'With Image' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Reviews" />
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="p-6">
            <div className="animate-pulse">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-12 bg-gray-200 rounded mb-2 dark:bg-gray-700"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Reviews" />
      
      <div className="space-y-6">
        {/* Filters */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Reviews ({reviews.length})
            </h3>
            <div className="w-48">
              <Select
                options={statusOptions}
                placeholder="Filter by status"
                onChange={(value) => setStatusFilter(value as ReviewStatus | 'all')}
                defaultValue={statusFilter}
              />
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="p-6">
            <div className="overflow-x-auto min-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Couple Name</TableCell>
                    <TableCell>Couple ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Telegram ID</TableCell>
                    <TableCell>Language</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Image Added</TableCell>
                    <TableCell>Approved</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {reviews.map((review, index) => (
                    <TableRow key={index} className='hover:bg-gray-100 dark:hover:bg-gray-800'>
                      <TableCell>
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {review.coupleName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                          {review.coupleId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ReviewStatusSelect
                          currentStatus={review.status}
                          reviewId={review.coupleId}
                          onStatusChange={handleStatusChange}
                          language={review.language}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-600 dark:text-gray-400">
                          {review.telegramId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-600 dark:text-gray-400">
                          {getLanguageText(review.language)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {review.firebaseImageUrl ? (
                          <button
                            onClick={() => handleImageClick(review.firebaseImageUrl!)}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            View Image
                          </button>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">No image</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-600 dark:text-gray-400">
                          {formatDate(review.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-600 dark:text-gray-400">
                          {formatDate(review.imageAddedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-600 dark:text-gray-400">
                          {formatDate(review.approvedAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {reviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No reviews found for the selected status.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

        {selectedImage && (
          <ImageModal
            isOpen={isImageModalOpen}
            onClose={closeImageModal}
            imageUrl={selectedImage}
            title={`Review Image - ${reviews.find(r => r.firebaseImageUrl === selectedImage)?.coupleName || 'Unknown'}`}
          />
        )}
    </div>
  );
};

export default ReviewsPage; 