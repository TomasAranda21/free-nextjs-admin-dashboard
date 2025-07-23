"use client";

import React from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import UsersTable from "@/components/dashboard/UsersTable";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { stats, users, loading, error } = useDashboardData();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />
      
      {/* Users Table */}
      <UsersTable users={users} loading={loading} />
    </div>
  );
}
