import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { auth } from '../firebase';
import { ReviewStatus } from '@/types';

interface ApproveReviewData {
  reviewId: string;
  approved: boolean;
  rejectionReason?: string;
}

interface ApproveReviewResponse {
  success: boolean;
  status: ReviewStatus;
  message: string;
}

// Función para aprobar o rechazar una review
export const approveReview = async (
  reviewId: string, 
  approved: boolean, 
  rejectionReason?: string
): Promise<ApproveReviewResponse> => {
  try {
    // Primero intentamos con Firebase Functions
    try {
      const approveReviewFunction = httpsCallable<ApproveReviewData, ApproveReviewResponse>(
        functions,
        'approveReview'
      );

      const result = await approveReviewFunction({
        reviewId,
        approved,
        rejectionReason
      });

      return result.data;
    } catch {
      console.log('Firebase Functions failed, trying direct URL...');
      
      // Si falla, intentamos con la URL directa
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();
      
      const response = await fetch('/api/approve-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            reviewId,
            approved,
            rejectionReason
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.result;
    }
  } catch (error) {
    console.error('Error calling approveReview function:', error);
    throw new Error('Error processing review approval');
  }
}; 