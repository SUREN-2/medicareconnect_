"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicationCalendarCard } from "@/components/calendar-card";
import NotificationSettingsCard from "@/components/notification-card";
import MedicationProgressCard from "@/components/progress-card";
import HeroCards from "./hero-cards";
import RecentActivityCard from "./activity-card";

type Props = {
  value: string;
  onChange: (val: string) => void;
  stats?: any;
};

function DashboardTabsbs({ value, onChange, stats }: Props) {
  return (
    <Tabs
      value={value}
      onValueChange={onChange}
      defaultValue="user_dashboard"
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full sm:hidden max-w-xl bg-muted/50 backdrop-blur-md rounded-2xl p-1">
        <TabsTrigger value="user_dashboard">User Dashboard</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="user_dashboard" className="mt-6 space-y-4">
        <HeroCards stats={stats} />
        <MedicationProgressCard stats={stats} />
      </TabsContent>

      <TabsContent value="activity" className="mt-6">
        <RecentActivityCard />
      </TabsContent>

      <TabsContent value="calendar" className="mt-6">
        <MedicationCalendarCard />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <NotificationSettingsCard />
      </TabsContent>
    </Tabs>
  );
}

export default React.memo(DashboardTabsbs);
