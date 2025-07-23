"use client";

import React from 'react';
import { DashboardStats } from '@/types';
import { UserIcon, UserCircleIcon, GroupIcon, ChatIcon } from '@/icons';

interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading = false }) => {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <UserCircleIcon />,
      color: "bg-blue-500",
      textColor: "text-blue-500"
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers,
      icon: <UserIcon />,
      color: "bg-yellow-500",
      textColor: "text-yellow-500"
    },
    {
      title: "Free Users",
      value: stats.freeUsers,
      icon: <GroupIcon />,
      color: "bg-green-500",
      textColor: "text-green-500"
    },
    {
      title: "Couples",
      value: stats.couples,
      icon: <ChatIcon />,
      color: "bg-pink-500",
      textColor: "text-pink-500"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 dark:bg-gray-700"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {card.value.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
              <div className={card.textColor}>
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards; 