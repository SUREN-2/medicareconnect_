import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { usePatientWeekStats } from "@/hooks/use-PatientLogs";
import { format } from "date-fns";
import { Card } from "./ui/card";

type Activity = {
  day: string;
  date: string;
  time: string;
  status: string;
  url: string;
};

type PatientLog = {
  date: string;
  status: string;
  time: string;
  taken_at: string;
  url: string;
};

function RecentActivityCard() {
  const { data: stats, isLoading: weekStatsLoading } = usePatientWeekStats();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const activities: Activity[] = useMemo(() => {
    if (!stats?.data) return [];

    return stats.data.map((item: PatientLog) => ({
      day: format(new Date(item.date), "EEEE"),
      date: format(new Date(item.date), "MMM dd"),
      time: item.taken_at,
      status: item.status === "taken" ? "completed" : item.status,
      url: item.url,
    }));
  }, [stats]);

  if (weekStatsLoading) {
    return (
      <Card className="p-6 rounded-2xl shadow-lg bg-white">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <div className="w-full bg-card border rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-l-primary">
        <i className="bi bi-clock-history"></i> Recent Activity
      </h2>

      <div className="flex flex-col gap-3">
        {activities.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border bg-muted/40"
          >
            <div className="flex items-center">
              <span className="me-4 text-2xl">
                {item.status === "completed" ? (
                  <i className="bi bi-check-circle-fill text-green-600"></i>
                ) : item.status === "pending" ? (
                  <i className="bi bi-three-dots text-blue-600"></i>
                ) : (
                  <i className="bi bi-x-circle-fill text-red-600"></i>
                )}
              </span>

              <div className="flex flex-col">
                <span className="font-semibold">
                  {item.day} • {item.date}
                </span>
                <span className="text-sm text-muted-foreground">
                  Taken at: {item.time}
                </span>
              </div>
            </div>

            <div>
              {item.url ? (
                <Badge
                  onClick={() => setPreviewUrl(item.url)}
                  className="me-2 capitalize border-black text-black bg-transparent cursor-pointer"
                >
                  Photo
                </Badge>
              ) : (
                " "
              )}

              <Badge
                className={`capitalize ${
                  item.status === "completed"
                    ? "border-green-600 bg-green-50 text-green-700 text-sm"
                    : item.status === "pending"
                      ? "border-blue-600 bg-blue-50 text-blue-700 text-sm"
                      : "border-red-600 bg-red-50 text-red-700 text-sm"
                }`}
              >
                {item.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewUrl(null)}
        >
          <img
            src={previewUrl}
            alt="preview"
            className="max-h-[80%] max-w-[90%] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(RecentActivityCard);
