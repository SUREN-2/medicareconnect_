"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";


export const useNotifications = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/patient/notification");
      return res.data;
    },
    enabled: !!accessToken,
  });
};


type ReminderSettingsPayload = {
  schedule_time: string;
  remainder_hours: number;
  email: string;
  email_subject: string;
  email_body: string;
  reminder_enabled: boolean;
};

export const useUpdateReminderSettings = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReminderSettingsPayload) => {
      const res = await api.post("/patient/notification/set-notification", {
        schedule_time: data.schedule_time,
        remainder_hours: data.remainder_hours,
        email: data.email,
        email_subject: data.email_subject,
        email_body: data.email_body,
        reminder_enabled: data.reminder_enabled,
      });

      return res.data;
    },

    // onSuccess: () => {
    //   // Refetch updated settings
    //   queryClient.invalidateQueries({ queryKey: ["settings"] });
    //   queryClient.invalidateQueries({ queryKey: ["notifications"] }); // optional
    // },
  });
};