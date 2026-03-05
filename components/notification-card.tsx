"use client";

import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  useNotifications,
  useUpdateReminderSettings,
} from "@/hooks/use-Notification";

const schema = z
  .object({
    emailEnabled: z.boolean(),

    caretakerEmail: z
      .string()
      .trim()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),

    alertAfter: z.string().min(1, "Select alert time"),

    reminderTime: z
      .string()
      .min(1, "Enter reminder time")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),

    subject: z.string().trim().min(3, "Subject required"),
    content: z.string().trim().min(10, "Content too short"),
  })
  .superRefine((data, ctx) => {
    if (data.emailEnabled && !data.caretakerEmail) {
      ctx.addIssue({
        path: ["caretakerEmail"],
        code: z.ZodIssueCode.custom,
        message: "Email is required when notifications are enabled",
      });
    }
  });

type FormData = z.infer<typeof schema>;

export default function NotificationSettingsCard() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailEnabled: false,
      caretakerEmail: "",
      alertAfter: "",
      reminderTime: "",
      subject: "",
      content: "",
    },
  });

  const emailEnabled = watch("emailEnabled");

  const { data, isLoading } = useNotifications();

  const updateSettings = useUpdateReminderSettings();

  useEffect(() => {
    if (data?.data) {
      const settings = data.data;

      setValue("emailEnabled", settings.reminder_enabled);
      setValue("caretakerEmail", settings.email || "");
      setValue("alertAfter", String(settings.remainder_hours || ""));
      setValue("reminderTime", settings.schedule_time || "");
      setValue("subject", settings.email_subject || "");
      setValue("content", settings.email_body || "");
    }
  }, [data, setValue]);

  const sanitize = (value: string) => value.replace(/[<>]/g, "");

  const onSubmit = (data: FormData) => {
    const cleanData = {
      schedule_time: data.reminderTime,
      remainder_hours: Number(data.alertAfter),
      email: sanitize(data.caretakerEmail || ""),
      email_subject: sanitize(data.subject),
      email_body: sanitize(data.content),
      reminder_enabled: data.emailEnabled,
    };

    updateSettings.mutate(cleanData, {
      onSuccess: () => {
        toast.success("Preferences saved successfully");
      },
      onError: () => {
        toast.error("Failed to save settings");
      },
    });
  };

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <Card className="w-full mx-auto rounded-2xl gap-0 shadow-xl border bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-l-primary flex items-center gap-2">
          <i className="bi bi-bell"></i> Notification Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">
              <i className="bi bi-envelope text-red-500"></i> Email
              Notifications
            </Label>
            <Switch
              checked={emailEnabled}
              onCheckedChange={(val) => setValue("emailEnabled", val)}
            />
          </div>

          <Input
            placeholder="Caretaker Email Address"
            disabled={!emailEnabled}
            {...register("caretakerEmail")}
          />
          {errors.caretakerEmail && (
            <p className="text-red-500 text-sm">
              {errors.caretakerEmail.message}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border space-y-5">
          <Label className="text-lg font-semibold">
            <i className="bi bi-alarm text-blue-500"></i> Missed Alerts
          </Label>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Alert After (hrs)</Label>
              <Select
                onValueChange={(val) =>
                  setValue("alertAfter", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hour</SelectItem>
                  <SelectItem value="2">2 Hours</SelectItem>
                  <SelectItem value="3">3 Hours</SelectItem>
                  <SelectItem value="4">4 Hours</SelectItem>
                  <SelectItem value="5">5 Hour</SelectItem>
                  <SelectItem value="6">6 Hours</SelectItem>
                  <SelectItem value="7">7 Hours</SelectItem>
                  <SelectItem value="8">8 Hours</SelectItem>
                </SelectContent>
              </Select>
              {errors.alertAfter && (
                <p className="text-red-500 text-sm">
                  {errors.alertAfter.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Daily Reminder Time</Label>
              <Input type="time" {...register("reminderTime")} />
              {errors.reminderTime && (
                <p className="text-red-500 text-sm">
                  {errors.reminderTime.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border space-y-4">
          <Label className="text-lg font-semibold">
            <i className="bi bi-envelope-plus text-green-500"></i> Email Preview
          </Label>

          <Input placeholder="Subject" {...register("subject")} />
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject.message}</p>
          )}

          <Textarea
            placeholder="Email Content..."
            rows={5}
            {...register("content")}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-2 rounded-lg shadow-md hover:scale-105 transition"
            disabled={updateSettings.isPending}
          >
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
