"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IconUser } from "@tabler/icons-react";
import DashboardTabs from "@/components/dashtabs";
import { usePatientStats } from "@/hooks/use-PatientLogs";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddMedicationModal from "@/components/add-medication";

export default function Page() {
  const [activeTab, setActiveTab] = useState("user_dashboard");
  const [openMedicationModal, setOpenMedicationModal] = useState(false);

  const { accessToken } = useAuth();
  const router = useRouter();

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

  const { data: stats, isLoading: statsLoading } = usePatientStats();

  if (accessToken === undefined) {
    return <p>Loading...</p>;
  }

  if (statsLoading) {
    return <p>Loading data...</p>;
  }

  console.log(stats?.stats);

  const userData = stats?.stats ?? {
    patientName: "No Patient",
    totalMedications: 0,
    takenToday: 0,
    missedToday: 0,
  };

  return (
    <div className="">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" onNavigate={setActiveTab} />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col columns-md p-6">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-1 px-4 md:px-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center">
                    <IconUser className="w-6 h-6 text-primary" />

                    <h1 className="text-2xl md:text-3xl font-bold text-l-primary">
                      {userData?.patientName || "No Patient"}
                      <span className="text-muted-foreground text-lg font-normal">
                        {" "}
                        medication stats
                      </span>
                    </h1>
                  </div>

                  <Button
                    className="me-2"
                    onClick={() => setOpenMedicationModal(true)}
                  >
                    Add Medication
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 py-4 md:gap-6 md:pt-6 md:pb-0">
                <SectionCards />
              </div>

              <div className="flex flex-col px-4 gap-4 py-0 md:gap-6 md:py-0  ">
                <DashboardTabs value={activeTab} onChange={setActiveTab} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <AddMedicationModal
        open={openMedicationModal}
        onOpenChange={setOpenMedicationModal}
      />
    </div>
  );
}
