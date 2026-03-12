"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { usePatientLogs } from "@/hooks/use-PatientLogs";

export function MedicationCalendarCard() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );

  const { data: logs, isLoading: logsLoading } = usePatientLogs();

  type StatusType = "taken" | "missed" | "pending";

  type MedicationData = {
    date: string;
    status: StatusType;
    time?: string;
    taken_at?: string;
  };

  const medicationData: MedicationData[] = logs?.data ?? [];

  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const selectedData = React.useMemo(() => {
    return medicationData.find((item) => item.date === selectedDateStr);
  }, [medicationData, selectedDateStr]);

  const { takenDates, missedDates, pendingDates } = React.useMemo(() => {
    const taken: Date[] = [];
    const missed: Date[] = [];
    const pending: Date[] = [];

    medicationData.forEach((item) => {
      const date = new Date(item.date);

      if (item.status === "taken") taken.push(date);
      else if (item.status === "missed") missed.push(date);
      else if (item.status === "pending") pending.push(date);
    });

    return {
      takenDates: taken,
      missedDates: missed,
      pendingDates: pending,
    };
  }, [medicationData]);

  return (
    <Card className="w-full rounded-2xl shadow-lg border bg-white ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#967ea7]">
          <span>
            <i className="bi bi-calendar-check"></i>
          </span>{" "}
          Medication Tracker
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col lg:flex-row gap-6 ">
        <div className="w-full lg:flex-1 ">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-xl border p-3 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto"
            classNames={{
              table:
                "w-full border-separate border-spacing-1 sm:border-spacing-2",

              head_row: "flex justify-between",
              row: "flex w-full justify-between mt-2",

              cell: "flex-1 flex justify-center",

              day: `
      h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12
      flex items-center justify-center
      rounded-md transition-all mx-auto
    `,

              day_selected: "bg-purple-200 text-purple-800",

              day_today: "bg-blue-100 text-blue-700",

              day_outside: "text-gray-300",
            }}
            modifiers={{
              taken: takenDates,
              missed: missedDates,
              pending: pendingDates,
            }}
            modifiersClassNames={{
              taken: "bg-green-100 text-green-700 border border-green-300",

              missed: "bg-red-100 text-red-600 border border-red-300",

              pending: "bg-blue-100 text-blue-600 border border-blue-300",
            }}
          />

          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-green-400"></span>
              <span className="text-s text-muted-foreground">Taken</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-400"></span>
              <span className="text-s text-muted-foreground">Missed</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-blue-400"></span>
              <span className="text-s text-muted-foreground">Pending</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:flex-1 bg-gray-50 rounded-xl p-6 shadow-inner border">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            <i className="bi bi-pin-angle-fill text-red-600"></i> Day Details
          </h3>

          {selectedDate ? (
            <>
              <p className="text-md text-gray-500 mb-3">
                {format(selectedDate, "EEEE, dd MMM yyyy")}
              </p>

              {selectedData ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border">
                    <span className="text-sm font-medium">
                      <i className="bi bi-capsule text-l-primary"></i> Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedData.status === "taken"
                          ? "bg-green-100 text-green-700"
                          : selectedData.status === "missed"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {selectedData.status === "taken"
                        ? "Taken"
                        : selectedData.status === "missed"
                          ? "Missed"
                          : "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border">
                    <span className="text-sm font-medium">
                      <i className="bi bi-alarm text-blue-400"></i> Time
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedData.taken_at || "N/A"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 mt-6">
                  <i className="bi bi-card-heading"></i> No records for this day
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">Select a date</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
