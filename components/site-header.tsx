import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IconLogout } from "@tabler/icons-react";
import { useLogout } from "@/hooks/use-Logout";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const { mutate: logout, isPending } = useLogout();
  const router = useRouter();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 max-xl:">
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-white font-medium">Caretaker Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            className="md:hidden bg-white text-purple-700 hover:bg-gray-100 !curson-pointer !important"
            onClick={() => router.push("/patient")}
          >
            <i className="bi bi-person"></i> Patient
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => logout()}
            disabled={isPending}
          >
            <IconLogout />
            <span>{isPending ? "Logging out..." : "Logout"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
