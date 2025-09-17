'use client';

import React from 'react';
import { Users, UserCheck, Shield, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/userManagementApi';

interface UserStatsCardsProps {
  users: User[];
  totalCount: number;
}

export function UserStatsCards({ users, totalCount }: UserStatsCardsProps) {
  // Calculate stats from the current page of users
  const adminCount = users.filter(user => user.role.toLowerCase() === 'admin').length;
  const agentCount = users.filter(user => user.role.toLowerCase() === 'user').length;

  const statsCards = [
    {
      title: 'Total Users',
      value: totalCount.toString(),
      description: 'All users in organization',
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Users',
      value: users.length.toString(),
      description: 'Currently loaded users',
      icon: UserCheck,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Administrators',
      value: adminCount.toString(),
      description: 'Users with admin access',
      icon: Shield,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Agents',
      value: agentCount.toString(),
      description: 'Users with agent role',
      icon: Crown,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}