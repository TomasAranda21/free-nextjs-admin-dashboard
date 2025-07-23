import { 
  collection, 
  getDocs, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { IUser, DashboardStats } from '@/types';

// Users collection
const USERS_COLLECTION = 'users';

// Users services
export const getUsers = async (): Promise<IUser[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as IUser[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await getDocs(usersRef);
    
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as IUser[];
    
    const totalUsers = users.length;
    const premiumUsers = users.filter(user => user.isPremium).length;
    const freeUsers = totalUsers - premiumUsers;
    
    // Count couples (users with myCoupleId)
    const couples = users.filter(user => user.myCoupleId !== null).length / 2; // Divide by 2 since each couple has 2 users
    
    return {
      totalUsers,
      premiumUsers,
      freeUsers,
      couples: Math.floor(couples)
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 