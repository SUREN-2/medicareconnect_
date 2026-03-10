"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { IconHeartHandshake } from "@tabler/icons-react";
import UploadProof from "@/components/upload-proof";
import { usePatientLogs, usePatientStats } from "@/hooks/use-PatientLogs";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useLogout } from "@/hooks/use-Logout";
import { useTakeMedication } from "@/hooks/use-TakeMedication";
import { toast } from "sonner";

export default function PatientPage() {
  const { accessToken } = useAuth();

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isTaken, setIsTaken] = useState(false);

  const router = useRouter();

  const { mutate: logout, isPending } = useLogout();

  const { data: stats, isLoading: statsLoading } = usePatientStats();
  const { data: logs, isLoading: logsLoading } = usePatientLogs();
  const { mutate: takeMedication, isPending: taking } = useTakeMedication({
    onSuccess: () => {
      setIsTaken(true);
      setPhotoUrl(null);
    },
  });

  useEffect(() => {
    if (accessToken === null) {
      router.push("/auth/login");
    }
  }, [accessToken, router]);

  if (accessToken === undefined) {
    return <p>Loading...</p>;
  }

  if (accessToken === null) {
    return null;
  }

  if (statsLoading || logsLoading) {
    return <p>Loading ...</p>;
  }

  const userData = stats?.stats || null;

  // console.log("new" + userData);

  const cleanData = {
    medicationId: userData?.medicineId,
    photoUrl: photoUrl || undefined,
  };

  const handleTakeMedication = () => {
    if (isTaken) return;
    takeMedication(cleanData, {
      onSuccess: () => {
        toast.success("Medicine marked as Taken");
      },
      onError: () => {
        toast.error("Failed to taken medicine");
      },
    });
  };

  type StatusType = "taken" | "missed" | "pending";

  type MedicationData = {
    date: string;
    status: StatusType;
    time?: string;
  };
  const isDisabled = userData?.todayStatus === "taken";

  const medicationData: MedicationData[] = logs?.data || [];

  const schedule_time = userData?.scheduleTime
    ? format(new Date(`2000-01-01T${userData.scheduleTime}`), "hh:mm a")
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div
          className="flex justify-between items-center mb-8 p-5 rounded-2xl 
                        bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <IconHeartHandshake size={30} stroke={2} />
            <h1 className="text-xl md:text-2xl font-bold">Medicare Connect</h1>
          </div>

          <div className="flex gap-3">
            <Button
              className="bg-white text-purple-700 hover:bg-gray-100 !curson-pointer !important"
              onClick={() => router.push("/caretaker")}
            >
              <i className="bi bi-person"></i> Caretaker
            </Button>
            <Button variant="destructive" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center text-3xl font-bold text-gray-800 ">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome back{" "}
              <span className="text-3xl text-l-primary">
                {userData?.patientName ?? "User"}
              </span>{" "}
              !
            </h2>
          </div>

          <p className="text-gray-500 mt-1">
            Stay consistent with your medication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-purple-300 to-indigo-200 border border-purple-300 backdrop-blur-md">
            <p className="text-xl font-medium ">
              <i className="bi bi-clock-history text-indigo-500"></i> Today
              Status
            </p>

            <h3 className="text-2xl font-bold mt-1 text-purple-900">
              {userData?.todayStatus === "pending" ? (
                <Badge className="bg-blue-100 text-lg text-blue-600 border border-blue-300 px-5">
                  Pending
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-lg text-green-600 border border-green-300 ">
                  Taken
                </Badge>
              )}
            </h3>
          </Card>

          <Card className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-purple-300 to-indigo-200 border border-purple-300">
            <p className="text-xl font-medium">
              <i className="bi bi-fire text-yellow-500"></i> Day Streak
            </p>

            <h3 className="text-2xl font-bold mt-1 text-purple-900">
              {userData?.streak ?? 0} Days
            </h3>
          </Card>

          <Card className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-purple-300 to-indigo-200 border border-purple-300">
            <p className="text-xl  font-medium">
              <i className="bi bi-activity "></i> Consistency Rate
            </p>

            <h3 className="text-2xl mt-1 font-bold text-purple-900">
              {userData?.consistencyRate ?? 0}%
            </h3>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 rounded-2xl shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold ">
                <span>
                  <i className="bi bi-calendar-check text-l-primary"></i>
                </span>{" "}
                Medication Tracker
              </CardTitle>
            </CardHeader>

            <Calendar
              mode="single"
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
                taken: medicationData
                  .filter((d) => d.status === "taken")
                  .map((d) => new Date(d.date)),

                missed: medicationData
                  .filter((d) => d.status === "missed")
                  .map((d) => new Date(d.date)),

                pending: medicationData
                  .filter((d) => d.status === "pending")
                  .map((d) => new Date(d.date)),
              }}
              modifiersClassNames={{
                taken: "bg-green-100 text-green-700 border border-green-300",
                missed: "bg-red-100 text-red-600 border border-red-300",
                pending: "bg-blue-100 text-blue-600 border border-blue-300",
              }}
            />

            <div className="flex items-center justify-center gap-3 mt-2">
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
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="p-6 rounded-2xl shadow-lg bg-white">
              <h3 className="text-lg font-semibold mb-4">
                <i className="bi bi-capsule text-green-500"></i> Today’s
                Medication
              </h3>

              <div className="bg-gray-50 p-4 rounded-xl border mb-4">
                <p className="text-sm text-gray-500">Medicine</p>
                <h4 className="text-lg font-bold">
                  {userData?.medicineName ?? "N/A"} {userData?.dosage ?? ""}
                </h4>

                <p className="text-sm text-gray-500 mt-2">Time</p>
                <h4 className="font-semibold">{schedule_time}</h4>
              </div>

              <Button
                className="w-full text-lg"
                onClick={handleTakeMedication}
                disabled={isDisabled}
              >
                {userData?.todayStatus === "taken"
                  ? "Already Taken"
                  : "Mark as Taken"}
              </Button>
            </Card>

            <Card className="p-6 rounded-2xl shadow-lg bg-white">
              <h3 className="text-lg font-semibold mb-4">
                <i className="bi bi-file-earmark-image text-indigo-400"></i>{" "}
                Upload Photo
              </h3>

              <UploadProof
                onUpload={(url) => setPhotoUrl(url)}
                disabled={isTaken}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
