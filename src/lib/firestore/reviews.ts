import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { IReview, ReviewStatus } from '@/types';

// Reviews collection
const REVIEWS_COLLECTION = 'reviews';

// Reviews services
export const getReviews = async (): Promise<IReview[]> => {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as IReview[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getReviewsByStatus = async (status: ReviewStatus): Promise<IReview[]> => {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const q = query(
      reviewsRef, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as IReview[];
  } catch (error) {
    console.error('Error fetching reviews by status:', error);
    throw error;
  }
};

export const updateReviewStatus = async (reviewId: string, status: ReviewStatus): Promise<void> => {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    const updateData: { status: ReviewStatus; approvedAt?: Timestamp } = { status };
    
    if (status === 'approved') {
      updateData.approvedAt = Timestamp.now();
    }
    
    await updateDoc(reviewRef, updateData);
  } catch (error) {
    console.error('Error updating review status:', error);
    throw error;
  }
}; 