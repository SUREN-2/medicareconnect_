"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function AppInitializer({ children }: any) {
  const { accessToken, setAccessToken } = useAuth();
  const pathname = usePathname();

  const isPublic = pathname === "/auth/login" || pathname === "/auth/signup";

  useEffect(() => {
    if (isPublic) return;

    const restore = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/auth/refresh",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (!res.ok) {
          setAccessToken(null);
          return;
        }

        const data = await res.json();
        setAccessToken(data.accessToken);
      } catch {
        setAccessToken(null);
      }
    };

    // only run if undefined (first load)
    if (accessToken === undefined) {
      restore();
    }
  }, [accessToken, isPublic, setAccessToken]);

  if (accessToken === undefined && !isPublic) {
    return <p>Loading...</p>;
  }

  return children;
}
