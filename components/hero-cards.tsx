import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePatientLogs, usePatientStats } from "@/hooks/use-PatientLogs";

import { IconUsers } from "@tabler/icons-react";

export function HeroCards() {
  const { data: stats, isLoading: statsLoading } = usePatientStats();

  console.log(stats);

  const userData = stats?.stats;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 sm:pt-0 w-full">
      <div className="w-full md:flex-1 rounded-xl border border-[#ab90bf]/30 bg-white shadow-lg transition-all hover:shadow-xl">
        <div className="p-6">
          <div className="flex items-center mb-4 text-xl font-bold tracking-tight gap-2">
            <span className="text-l-primary">
              <i className="bi bi-calendar text-l-primary"></i>
            </span>
            <h5 className="">Today Status</h5>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border py-3 px-4 shadow-sm bg-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <strong className="block text-muted-foreground text-sm">
                  Daily Medication Time
                </strong>
                <span className="block font-semibold text-lg text-black"></span>
              </div>

              <div className="flex items-center justify-center">
                {userData?.todayStatus == "pending" ? (
                  <>
                    <Badge className="bg-blue-100 text-md text-blue-600 border border-blue-300 ">
                      Pending
                    </Badge>{" "}
                  </>
                ) : (
                  <>
                    <Badge className="bg-green-100 text-md text-green-600 border border-green-300 ">
                      Taken
                    </Badge>{" "}
                  </>
                )}{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
