"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconHeartHandshake } from "@tabler/icons-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex flex-col">
      <div className="w-full px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <IconHeartHandshake size={30} stroke={2} />
            <h1 className="text-xl md:text-2xl font-bold">Medicare Connect</h1>
          </div>

          <Button
            variant="secondary"
            className="bg-white text-purple-700 hover:bg-gray-100"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Stay Consistent with Your{" "}
            <span className="text-purple-600">Medication</span>
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Track, manage, and never miss your daily medication with ease.
            Designed for both patients and caretakers.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={() => router.push("/patient")}
              className="px-10 py-6 text-lg rounded-xl shadow-lg 
              bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
              hover:scale-105 transition-all"
            >
              <i className="bi bi-person"></i> Patient
            </Button>

            <Button
              onClick={() => router.push("/caretaker")}
              className="px-10 py-6 text-lg rounded-xl shadow-lg 
              bg-white text-purple-700 border border-purple-300 
              hover:bg-gray-100 hover:scale-105 transition-all"
            >
              <i className="bi bi-people"></i> Caretaker
            </Button>
          </div>

          <div className="mt-12 text-sm text-gray-400">
            Trusted daily medication tracking system
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm pb-6">
        © {new Date().getFullYear()} Medicare Connect. All rights reserved.
      </div>
    </div>
  );
}
