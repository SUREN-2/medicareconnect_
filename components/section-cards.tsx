import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Stats = {
  consistencyRate?: number;
  streak?: number;
  missedDaysCurrentMonth?: number;
  takenCurrentWeek?: number;
};

type Props = {
  stats?: Stats;
};

function SectionCards({ stats }: Props) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-purple-200 justify-around">
        <CardHeader>
          <CardDescription>
            <div className="flex text-xl mb-1">
              <span className="pe-3 text-purple-800">
                <i className="bi bi-activity"></i>
              </span>
              Consistency Rate
            </div>
          </CardDescription>

          <CardTitle className="text-lg font-semibold tabular-nums @[180px]/card:text-2xl">
            {stats?.consistencyRate ?? "-"}%
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card bg-purple-200">
        <CardHeader>
          <CardDescription>
            <div className="flex text-xl mb-1">
              <span className="pe-3 text-yellow-500">
                <i className="bi bi-fire"></i>
              </span>
              Streak
            </div>
          </CardDescription>

          <CardTitle className="text-lg font-semibold tabular-nums @[180px]/card:text-2xl">
            {stats?.streak ?? "-"}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card bg-purple-200">
        <CardHeader>
          <CardDescription>
            <div className="flex text-xl mb-1">
              <span className="pe-3 text-red-500">
                <i className="bi bi-x-square"></i>
              </span>
              Missed This Month
            </div>
          </CardDescription>

          <CardTitle className="text-lg font-semibold tabular-nums @[180px]/card:text-2xl">
            {stats?.missedDaysCurrentMonth ?? "-"}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card bg-purple-200">
        <CardHeader>
          <CardDescription>
            <div className="flex text-xl mb-1">
              <span className="pe-3 text-green-500">
                <i className="bi bi-hand-thumbs-up-fill"></i>
              </span>
              Taken This Week
            </div>
          </CardDescription>

          <CardTitle className="text-lg font-semibold tabular-nums @[180px]/card:text-2xl">
            {stats?.takenCurrentWeek ?? "-"}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default React.memo(SectionCards);
