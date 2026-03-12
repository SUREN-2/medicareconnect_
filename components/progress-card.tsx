import React, { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

type Props = {
  stats?: any;
};

function MedicationProgressCard({ stats }: Props) {
  const userData = stats?.stats ?? null;

  const progress = useMemo(() => {
    return userData?.consistencyRate ?? 0;
  }, [userData]);

  const userStats = useMemo(
    () => ({
      taken: userData?.takenDaysCurrentMonth ?? "-",
      missed: userData?.missedDaysCurrentMonth ?? "-",
      remaining: userData?.remainingDaysCurrentMonth ?? "-",
    }),
    [userData],
  );

  return (
    <div className="flex flex-col rounded-xl border bg-card p-6 mx-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Medication Progress</h3>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Monthly Adherence</span>
        <span className="text-sm font-semibold text-primary">{progress}%</span>
      </div>

      <Progress value={progress} className="h-3 mb-4 [&>div]:bg-purple-500" />

      <div className="grid grid-cols-3 gap-3 text-center mt-2">
        <div className="rounded-lg bg-green-50 p-3">
          <p className="text-xs text-muted-foreground">Taken</p>
          <p className="text-lg font-bold text-green-700">{userStats.taken}</p>
        </div>

        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-xs text-muted-foreground">Missed</p>
          <p className="text-lg font-bold text-red-600">{userStats.missed}</p>
        </div>

        <div className="rounded-lg bg-yellow-50 p-3">
          <p className="text-xs text-muted-foreground">Remaining</p>
          <p className="text-lg font-bold text-yellow-600">
            {userStats.remaining}
          </p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MedicationProgressCard);
