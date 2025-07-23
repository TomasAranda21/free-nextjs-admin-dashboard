import { useState, useEffect } from 'react';
import { DashboardStats, IUser } from '@/types';
import { getDashboardStats, getUsers } from '@/lib/firestore';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    premiumUsers: 0,
    freeUsers: 0,
    couples: 0
  });
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsData, usersData] = await Promise.all([
          getDashboardStats(),
          getUsers()
        ]);
        
        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, usersData] = await Promise.all([
        getDashboardStats(),
        getUsers()
      ]);
      
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Error refreshing data');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    users,
    loading,
    error,
    refreshData
  };
}; 